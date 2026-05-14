import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-change-me-in-production';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    if ((user as any).status !== 'active') {
      return NextResponse.json({ success: false, error: `Account is ${(user as any).status}` }, { status: 403 });
    }

    if ((user as any).role !== 'administrator') {
      return NextResponse.json({ success: false, error: 'Only administrators can log in' }, { status: 403 });
    }

    const isPasswordValid = verifyPassword(password, (user as any).password_hash) || 
                           ((user as any).temp_password ? password === (user as any).temp_password : false);
    
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    // Check organization suspension
    if (((user as any).role === 'manager' || (user as any).role === 'agent') && (user as any).organization_id) {
      const { data: orgData } = await supabase
        .from('users')
        .select('status')
        .eq('id', (user as any).organization_id)
        .eq('role', 'organization')
        .single();

      if ((orgData as any)?.status === 'suspended') {
        return NextResponse.json({ success: false, error: 'Organization is suspended' }, { status: 403 });
      }
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: (user as any).email,
        role: (user as any).role,
        organizationId: (user as any).organization_id
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        user_id: user.id,
        email: (user as any).email,
        name: (user as any).name,
        role: (user as any).role,
        status: (user as any).status,
        permissions: (user as any).permissions || [],
        organization_id: (user as any).organization_id
      }
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

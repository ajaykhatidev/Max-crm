import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth-utils';
import { Database } from '@/types/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-change-me-in-production';
type UserRow = Database['public']['Tables']['users']['Row'];
type LoginBody = { email?: string; password?: string };

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginBody;

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

    const typedUser = user as UserRow;

    if (typedUser.status !== 'active') {
      return NextResponse.json({ success: false, error: `Account is ${typedUser.status}` }, { status: 403 });
    }

    if (typedUser.role !== 'administrator') {
      return NextResponse.json({ success: false, error: 'Only administrators can log in' }, { status: 403 });
    }

    const isPasswordValid =
      verifyPassword(password, typedUser.password_hash) ||
      (typedUser.temp_password ? password === typedUser.temp_password : false);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: typedUser.id,
        email: typedUser.email,
        role: typedUser.role,
        organizationId: typedUser.organization_id,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        user_id: typedUser.id,
        email: typedUser.email,
        name: typedUser.name,
        role: typedUser.role,
        status: typedUser.status,
        permissions: typedUser.permissions || [],
        organization_id: typedUser.organization_id,
      },
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

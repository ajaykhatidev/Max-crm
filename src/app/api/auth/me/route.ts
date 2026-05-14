import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-change-me-in-production';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, status, permissions, organization_id')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if ((user as any).status !== 'active') {
      return NextResponse.json({ success: false, error: `Account is ${(user as any).status}` }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
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
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}

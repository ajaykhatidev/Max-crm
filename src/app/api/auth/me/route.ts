import { NextResponse } from 'next/server';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-change-me-in-production';
type UserRow = Pick<
  Database['public']['Tables']['users']['Row'],
  'id' | 'email' | 'name' | 'role' | 'status' | 'permissions' | 'organization_id'
>;
type TokenPayload = JwtPayload & { userId: string };

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const userId = decoded.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, status, permissions, organization_id')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const typedUser = user as UserRow;

    if (typedUser.status !== 'active') {
      return NextResponse.json({ success: false, error: `Account is ${typedUser.status}` }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
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
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth-utils';
import { Database } from '@/types/supabase';

type CreateUserBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  permissions?: string[];
  features?: string[];
};
type UserInsert = Database['public']['Tables']['users']['Insert'];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateUserBody;
    const { name, email, password, role, permissions, features } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const passwordHash = hashPassword(password);

    const insertPayload: UserInsert = {
      name,
      email,
      password_hash: passwordHash,
      role,
      permissions: permissions || [],
      features: features || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('users').insert([insertPayload] as never).select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error('Error in create user API:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unable to create user' },
      { status: 500 }
    );
  }
}

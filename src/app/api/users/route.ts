import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, permissions, features } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await (supabase.from('users') as any)
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const passwordHash = hashPassword(password);

    const { data, error } = await (supabase.from('users') as any).insert([{
      name,
      email,
      password_hash: passwordHash,
      role,
      permissions: permissions || [],
      features: features || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]).select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in create user API:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

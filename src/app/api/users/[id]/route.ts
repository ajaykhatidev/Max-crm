import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth-utils';
import { Database } from '@/types/supabase';

type UpdateUserBody = {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  permissions?: string[];
  features?: string[];
  password?: string;
};
type UserUpdate = Database['public']['Tables']['users']['Update'];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateUserBody;
    const { name, email, role, status, permissions, features, password } = body;

    const updateData: UserUpdate = {
      name,
      email,
      role,
      status,
      permissions,
      features,
      updated_at: new Date().toISOString(),
    };

    if (password) {
      updateData.password_hash = hashPassword(password);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData as never)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error('Error updating user:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unable to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error deleting user:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unable to delete user' },
      { status: 500 }
    );
  }
}

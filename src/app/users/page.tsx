'use client';

import { useCallback, useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  Box,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  EyeOff,
  Handshake,
  Key,
  Mail,
  Settings,
  Target,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

const ROLES = ['agent', 'administrator', 'manager', 'channel_partner', 'other', 'independent_agent'];

const AVAILABLE_PERMISSIONS = [
  'access_leads',
  'edit_leads',
  'delete_leads',
  'access_inventory',
  'edit_inventory',
  'edit_unit_btn',
  'access_performance',
  'access_settings',
  'manage_users',
  'manage_unit_timeline:false',
];

const AVAILABLE_FEATURES = ['leads', 'deals', 'units', 'organizations_management'];

const PERM_META: Record<string, { label: string; desc: string; icon: LucideIcon }> = {
  access_leads: { label: 'Access Leads', desc: 'Can view leads data', icon: Eye },
  edit_leads: { label: 'Edit Leads', desc: 'Can modify existing leads', icon: Edit2 },
  delete_leads: { label: 'Delete Leads', desc: 'Can remove leads from system', icon: Trash2 },
  access_inventory: { label: 'Access Inventory', desc: 'Can view unit availability', icon: Box },
  edit_inventory: { label: 'Edit Inventory', desc: 'Can modify unit details', icon: Settings },
  edit_unit_btn: { label: 'Edit Unit Button', desc: 'Access to unit editing controls', icon: Edit2 },
  access_performance: { label: 'Access Performance', desc: 'Can view analytics and reports', icon: TrendingUp },
  access_settings: { label: 'Access Settings', desc: 'Can modify system settings', icon: Settings },
  manage_users: { label: 'Manage Users', desc: 'Can create and edit team members', icon: Users },
  'manage_unit_timeline:false': {
    label: 'Manage Unit Timeline',
    desc: 'Access to unit timeline history',
    icon: Clock,
  },
};

const FEATURE_META: Record<string, { label: string; desc: string; icon: LucideIcon }> = {
  leads: { label: 'Leads Management', desc: 'Track and manage potential clients', icon: Target },
  deals: { label: 'Deals Management', desc: 'Track and manage business deals', icon: Handshake },
  units: { label: 'Inventory (Units)', desc: 'Stock and unit availability', icon: Box },
  organizations_management: {
    label: 'Organizations',
    desc: 'System level configurations',
    icon: Building2,
  },
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'permissions' | 'features'>('permissions');
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, signOut } = useAuth();

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
    status: 'active',
    permissions: [] as string[],
    features: [] as string[],
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error: fetchError, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (fetchError) {
        throw fetchError;
      }

      setUsers((data as UserRow[]) || []);
      setTotalCount(count || 0);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    void (async () => {
      await fetchUsers();
    })();
  }, [fetchUsers]);

  const resetForm = () => {
    setEditingUser(null);
    setShowPassword(false);
    setActiveTab('permissions');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'agent',
      status: 'active',
      permissions: [],
      features: [],
    });
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (selectedUser: UserRow) => {
    setEditingUser(selectedUser);
    setShowPassword(false);
    setActiveTab('permissions');
    setFormData({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      password: '',
      role: selectedUser.role || 'agent',
      status: selectedUser.status || 'inactive',
      permissions: (selectedUser.permissions as string[]) || [],
      features: (selectedUser.features as string[]) || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PATCH' : 'POST';
      const payload = { ...formData } as Record<string, unknown>;

      if (editingUser && !payload.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }

      setIsModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Unable to save user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserRow) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Unable to update status.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete user');
      }

      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Unable to delete user.');
    }
  };

  const togglePermission = (permission: string) => {
    setFormData((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));
  };

  return (
    <AuthGuard>
      <AppShell
        userName={user?.name || user?.email || 'Team Member'}
        eyebrow="People operations"
        title="Users"
        description="A tidier access-management workspace for roles, permissions, and feature control across the CRM."
        onSignOut={signOut}
        action={
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 rounded-full bg-[var(--surface-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f252d]"
          >
            <UserPlus className="h-4 w-4" />
            Create user
          </button>
        }
      >
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Total users', String(totalCount).padStart(2, '0'), 'Managed team records'],
            ['Current page', String(currentPage), 'Pagination position'],
            ['Access groups', String(ROLES.length), 'Defined role types'],
          ].map(([label, value, caption]) => (
            <article key={label} className="panel soft-ring rounded-[28px] p-5">
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">{label}</p>
              <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{value}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{caption}</p>
            </article>
          ))}
        </section>

        <section className="panel-strong soft-ring rounded-[32px] overflow-hidden">
          {loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="spinner h-12 w-12" />
              <p className="text-sm text-[var(--muted)]">Loading team members...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1ee] text-[#93442f]">
                <AlertCircle className="h-8 w-8" />
              </div>
              <p className="max-w-md text-sm text-[#93442f]">{error}</p>
              <button
                type="button"
                onClick={fetchUsers}
                className="rounded-full bg-[var(--surface-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f252d]"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-[var(--line)] bg-white/45">
                    <tr className="text-sm text-[var(--muted)]">
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-sm text-[var(--muted)]">
                          No users found in the system.
                        </td>
                      </tr>
                    ) : (
                      users.map((row) => (
                        <tr key={row.id} className="border-b border-[var(--line)] last:border-b-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] font-semibold text-[var(--accent-strong)]">
                                {row.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[var(--text)]">{row.name || 'Unnamed user'}</p>
                                <p className="mt-1 text-sm text-[var(--muted)]">{row.email || 'No email'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold capitalize text-[var(--accent-strong)]">
                              {row.role || 'agent'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStatus(row)}
                              className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out outline-none ${
                                row.status === 'active' ? 'bg-[var(--accent)]' : 'bg-[#ece8df]'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  row.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className="ml-3 text-xs font-semibold capitalize text-[var(--muted)]">
                              {row.status || 'inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--muted)]">
                            {new Date(row.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(row)}
                                className="rounded-full border border-[var(--line)] bg-white/80 p-2 text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                aria-label="Edit user"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(row.id)}
                                className="rounded-full border border-[#e7b7ab] bg-[#fff1ee] p-2 text-[#93442f] transition hover:bg-[#fde4de]"
                                aria-label="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalCount > pageSize ? (
                <div className="flex flex-col gap-4 border-t border-[var(--line)] bg-white/40 px-6 py-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-[var(--muted)]">
                    Page <span className="font-semibold text-[var(--text)]">{currentPage}</span> of {totalPages}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                      className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--text)] transition disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
                      className="flex items-center gap-2 rounded-full bg-[var(--surface-dark)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f252d] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>

        {isModalOpen ? (
          <div className="animated-fade fixed inset-0 z-50 flex items-center justify-center bg-[#14333c]/40 p-4 backdrop-blur-md">
            <div className="panel-strong soft-ring max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[34px]">
              <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                    {editingUser ? 'Update access' : 'New team member'}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    {editingUser ? 'Edit user profile' : 'Create user profile'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-[var(--line)] bg-white/75 p-2 text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[72vh] overflow-y-auto px-6 py-6">
                <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
                  <section className="rounded-[28px] border border-[var(--line)] bg-white/65 p-5">
                    <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                      Identity
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Full name</span>
                        <input
                          required
                          value={formData.name}
                          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                          placeholder="John Doe"
                          className="w-full rounded-[20px] border border-[var(--line)] bg-white/75 px-4 py-3 text-sm text-[var(--text)] outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Email address</span>
                        <div className="flex items-center gap-3 rounded-[20px] border border-[var(--line)] bg-white/75 px-4 py-3">
                          <Mail className="h-4 w-4 text-[var(--muted)]" />
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                            placeholder="john@example.com"
                            className="w-full bg-transparent text-sm text-[var(--text)] outline-none"
                          />
                        </div>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[var(--text)]">
                          {editingUser ? 'Reset password' : 'Password'}
                        </span>
                        <div className="flex items-center gap-3 rounded-[20px] border border-[var(--line)] bg-white/75 px-4 py-3">
                          <Key className="h-4 w-4 text-[var(--muted)]" />
                          <input
                            required={!editingUser}
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                            placeholder={editingUser ? 'Leave blank to keep current password' : 'Create strong password'}
                            className="w-full bg-transparent text-sm text-[var(--text)] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="text-[var(--muted)] transition hover:text-[var(--accent)]"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[var(--text)]">System role</span>
                        <select
                          value={formData.role}
                          onChange={(event) => {
                            const newRole = event.target.value;
                            setFormData({
                              ...formData,
                              role: newRole,
                              permissions:
                                newRole === 'administrator'
                                  ? ['manage_unit_timeline:false', 'edit_unit_btn']
                                  : [],
                              features:
                                newRole === 'administrator'
                                  ? ['leads', 'deals', 'units', 'organizations_management']
                                  : [],
                            });
                          }}
                          className="w-full rounded-[20px] border border-[var(--line)] bg-white/75 px-4 py-3 text-sm text-[var(--text)] outline-none"
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Account status</span>
                        <select
                          value={formData.status}
                          onChange={(event) => setFormData({ ...formData, status: event.target.value })}
                          className="w-full rounded-[20px] border border-[var(--line)] bg-white/75 px-4 py-3 text-sm text-[var(--text)] outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-[var(--line)] bg-white/65 p-5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('permissions')}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          activeTab === 'permissions'
                            ? 'bg-[var(--surface-dark)] text-white'
                            : 'border border-[var(--line)] bg-white/75 text-[var(--text)]'
                        }`}
                      >
                        Permissions
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('features')}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          activeTab === 'features'
                            ? 'bg-[var(--surface-dark)] text-white'
                            : 'border border-[var(--line)] bg-white/75 text-[var(--text)]'
                        }`}
                      >
                        Features
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {(activeTab === 'permissions' ? AVAILABLE_PERMISSIONS : AVAILABLE_FEATURES).map((item) => {
                        const selected =
                          activeTab === 'permissions'
                            ? formData.permissions.includes(item)
                            : formData.features.includes(item);
                        const meta = activeTab === 'permissions' ? PERM_META[item] : FEATURE_META[item];
                        const Icon = meta.icon;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => (activeTab === 'permissions' ? togglePermission(item) : toggleFeature(item))}
                            className={`flex items-start gap-3 rounded-[22px] border p-4 text-left transition ${
                              selected
                                ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                                : 'border-[var(--line)] bg-white/75 hover:bg-white'
                            }`}
                          >
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[var(--accent)]">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="block">
                              <span className="block text-sm font-semibold text-[var(--text)]">{meta.label}</span>
                              <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{meta.desc}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </form>
              </div>

              <div className="flex justify-end gap-3 border-t border-[var(--line)] bg-white/45 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-[var(--line)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--text)] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="user-form"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-full bg-[var(--surface-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f252d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? <div className="spinner h-4 w-4 border-white/20 border-t-white" /> : editingUser ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {editingUser ? 'Save changes' : 'Create user'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </AppShell>
    </AuthGuard>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import Link from 'next/link';

type User = Database['public']['Tables']['users']['Row'];

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
  'manage_unit_timeline:false'
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
    permissions: [] as string[]
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'agent', permissions: [] });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', 
      role: user.role || 'agent',
      permissions: (user.permissions as string[]) || []
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PATCH' : 'POST';
      
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        delete (payload as any).password;
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }
      
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'agent', permissions: [] });
      fetchUsers();
    } catch (err: any) {
      alert(`Error ${editingUser ? 'updating' : 'creating'} user: ` + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete user');
      }
      
      fetchUsers();
    } catch (err: any) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'fit-content', marginBottom: '1rem' }}>
            ← Back to Dashboard
          </Link>
          <h1 className="premium-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>Users</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={handleOpenCreateModal}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
          >
            <span style={{ fontSize: '1.2rem' }}>+</span> Create User
          </button>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👥</span>
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{totalCount} Total</span>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Fetching users...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            <p>Error: {error}</p>
            <button className="btn-primary" style={{ margin: '1rem auto' }} onClick={fetchUsers}>Retry</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>User</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Department</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Joined</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.825rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: '500', textTransform: 'capitalize', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {user.department || user.designation || <span style={{ color: 'var(--text-muted)' }}>Not Assigned</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.status === 'active' ? '#10b981' : '#64748b', boxShadow: user.status === 'active' ? '0 0 8px #10b981' : 'none' }}></div>
                      <span style={{ fontSize: '0.875rem', textTransform: 'capitalize', color: user.status === 'active' ? 'var(--text-main)' : 'var(--text-muted)' }}>{user.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenEditModal(user)}
                        style={{ 
                          background: 'rgba(99, 102, 241, 0.1)', 
                          border: '1px solid rgba(99, 102, 241, 0.2)', 
                          color: 'var(--primary)', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          border: '1px solid rgba(239, 68, 68, 0.2)', 
                          color: '#ef4444', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && !error && totalCount > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--glass-border)',
              color: currentPage === 1 ? 'var(--text-muted)' : 'var(--primary)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: currentPage === page ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === Math.ceil(totalCount / pageSize)}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              background: currentPage === Math.ceil(totalCount / pageSize) ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--glass-border)',
              color: currentPage === Math.ceil(totalCount / pageSize) ? 'var(--text-muted)' : 'var(--primary)',
              cursor: currentPage === Math.ceil(totalCount / pageSize) ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          {/* Modal Content */}
          <div className="glass-card animate-fade-in" style={{
            width: '100%', maxWidth: '600px', maxHeight: '90vh',
            overflowY: 'auto', padding: '2.5rem',
            background: 'var(--bg-card)', border: '1px solid var(--glass-border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="premium-gradient" style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>
                {editingUser ? 'Edit User Permissions' : 'Create New User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Full Name</label>
                <input 
                  required
                  className="glass-card"
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Email Address</label>
                <input 
                  required
                  type="email"
                  className="glass-card"
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="user@example.com"
                />
              </div>

              {!editingUser && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      required={!editingUser}
                      type={showPassword ? 'text' : 'password'}
                      className="glass-card"
                      style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ 
                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                        fontSize: '1.1rem'
                      }}
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>User Role</label>
                <select 
                  className="glass-card"
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  value={formData.role}
                  onChange={e => {
                    const newRole = e.target.value;
                    const newPermissions = newRole === 'administrator' 
                      ? ['manage_unit_timeline:false', 'edit_unit_btn'] 
                      : [];
                    setFormData({...formData, role: newRole, permissions: newPermissions});
                  }}
                >
                  {ROLES.map(role => (
                    <option key={role} value={role} style={{ background: 'var(--bg-card)' }}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Permissions</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {AVAILABLE_PERMISSIONS.map(perm => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input 
                        type="checkbox"
                        checked={formData.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span style={{ color: formData.permissions.includes(perm) ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {perm.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

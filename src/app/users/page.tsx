'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import Link from 'next/link';
import { 
  Users, UserPlus, ChevronLeft, ChevronRight, 
  Edit2, Trash2, X, Eye, EyeOff, ArrowLeft, 
  Key, Box, TrendingUp, Settings, Clock, Target, 
  Handshake, Building2, User as UserIcon, Mail, Shield, AlertCircle,
  Star, Check
} from 'lucide-react';

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
  'manage_unit_timeline:false'
];

const AVAILABLE_FEATURES = [
  'leads',
  'deals',
  'units',
  'organizations_management'
];

const PERM_META: Record<string, { label: string, desc: string, icon: any }> = {
  'access_leads': { label: 'Access Leads', desc: 'Can view leads data', icon: Eye },
  'edit_leads': { label: 'Edit Leads', desc: 'Can modify existing leads', icon: Edit2 },
  'delete_leads': { label: 'Delete Leads', desc: 'Can remove leads from system', icon: Trash2 },
  'access_inventory': { label: 'Access Inventory', desc: 'Can view unit availability', icon: Box },
  'edit_inventory': { label: 'Edit Inventory', desc: 'Can modify unit details', icon: Settings },
  'edit_unit_btn': { label: 'Edit Unit Button', desc: 'Access to unit editing controls', icon: Edit2 },
  'access_performance': { label: 'Access Performance', desc: 'Can view analytics and reports', icon: TrendingUp },
  'access_settings': { label: 'Access Settings', desc: 'Can modify system settings', icon: Settings },
  'manage_users': { label: 'Manage Users', desc: 'Can create and edit team members', icon: Users },
  'manage_unit_timeline:false': { label: 'Manage Unit Timeline', desc: 'Access to unit timeline history', icon: Clock },
};

const FEATURE_META: Record<string, { label: string, desc: string, icon: any }> = {
  'leads': { label: 'Leads Management', desc: 'Track and manage potential clients', icon: Target },
  'deals': { label: 'Deals Management', desc: 'Track and manage business deals', icon: Handshake },
  'units': { label: 'Inventory (Units)', desc: 'Stock and unit availability', icon: Box },
  'organizations_management': { label: 'Organizations', desc: 'System level configurations', icon: Building2 },
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'permissions' | 'features'>('permissions');
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
    permissions: [] as string[],
    features: [] as string[]
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
      setUsers((data as any) || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, [currentPage]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'agent', permissions: [], features: [] });
    setShowPassword(false);
    setActiveTab('permissions');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserRow) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', 
      role: user.role || 'agent',
      permissions: (user.permissions as string[]) || [],
      features: (user.features as string[]) || []
    });
    setShowPassword(false);
    setActiveTab('permissions');
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
      setFormData({ name: '', email: '', password: '', role: 'agent', permissions: [], features: [] });
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

  const toggleFeature = (feat: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feat)
        ? prev.features.filter(f => f !== feat)
        : [...prev.features, feat]
    }));
  };

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors mb-4 px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold premium-gradient tracking-tight">Team Management</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage user access, roles, and permissions across the CRM.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="glass-card !p-3 !px-5 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Users</p>
              <p className="text-xl font-bold text-white">{totalCount}</p>
            </div>
          </div>
          <button 
            className="btn-primary shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300" 
            onClick={handleOpenCreateModal}
          >
            <UserPlus className="w-5 h-5" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-card !p-0 overflow-hidden shadow-2xl border border-white/5">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[400px] gap-4">
            <div className="spinner w-12 h-12"></div>
            <p className="text-slate-400 font-medium animate-pulse">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 mb-6 max-w-md">{error}</p>
            <button className="btn-primary !bg-red-500 hover:!bg-red-600" onClick={fetchUsers}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-sm">
                  <th className="p-4 pl-6 text-slate-300 font-semibold tracking-wide">User</th>
                  <th className="p-4 text-slate-300 font-semibold tracking-wide">Role & Dept</th>
                  <th className="p-4 text-slate-300 font-semibold tracking-wide">Status</th>
                  <th className="p-4 text-slate-300 font-semibold tracking-wide hidden sm:table-cell">Joined</th>
                  <th className="p-4 pr-6 text-right text-slate-300 font-semibold tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 mb-4 opacity-50" />
                        <p>No users found in the system.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">{user.name}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col items-start gap-2">
                          <span className="text-xs inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-full font-medium border border-indigo-500/20 capitalize shadow-sm">
                            <Shield className="w-3 h-3" />
                            {user.role}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {user.department || user.designation || 'General Staff'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-500'}`}></div>
                          <span className={`text-xs font-medium capitalize ${user.status === 'active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {user.status || 'inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 text-sm hidden sm:table-cell">
                        {mounted ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '...'}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex gap-2 justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEditModal(user)}
                            className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-lg transition-colors tooltip"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors tooltip"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && !error && totalCount > pageSize && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                  currentPage === page 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 border-none' 
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === Math.ceil(totalCount / pageSize)}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card animate-fade-in w-full max-w-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden shadow-2xl border border-white/10">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  {editingUser ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {editingUser ? 'Edit Team Member' : 'New Team Member'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form id="user-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Basic Info Section */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-1.5 text-slate-400 text-sm font-medium">Full Name <span className="text-red-400">*</span></label>
                      <input 
                        required
                        className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-slate-400 text-sm font-medium">Email Address <span className="text-red-400">*</span></label>
                      <input 
                        required
                        type="email"
                        className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <div>
                      <label className="block mb-1.5 text-slate-400 text-sm font-medium">
                        {editingUser ? 'Reset Password' : 'Password'} {editingUser ? '' : <span className="text-red-400">*</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Key className="w-4 h-4" />
                        </div>
                        <input 
                          required={!editingUser}
                          type={showPassword ? 'text' : 'password'}
                          className="w-full p-3 pl-10 pr-10 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          placeholder={editingUser ? "Leave blank to keep current" : "Create strong password"}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1.5 text-slate-400 text-sm font-medium">System Role</label>
                      <select 
                        className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
                        value={formData.role}
                        onChange={e => {
                          const newRole = e.target.value;
                          const newPermissions = newRole === 'administrator' 
                            ? ['manage_unit_timeline:false', 'edit_unit_btn'] 
                            : [];
                          const newFeatures = newRole === 'administrator'
                            ? ['leads', 'deals', 'units', 'organizations_management']
                            : [];
                          setFormData({...formData, role: newRole, permissions: newPermissions, features: newFeatures});
                        }}
                      >
                        {ROLES.map(role => (
                          <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Permissions & Features Section */}
                <div className="bg-white/5 rounded-2xl p-1 border border-white/5 flex flex-col">
                  {/* Tabs */}
                  <div className="flex border-b border-white/10 p-1">
                    <button 
                      type="button"
                      onClick={() => setActiveTab('permissions')}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex justify-center items-center gap-2 ${
                        activeTab === 'permissions' 
                          ? 'bg-indigo-500/20 text-indigo-400 shadow-inner border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <Key className="w-4 h-4" />
                      Permissions
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('features')}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex justify-center items-center gap-2 ${
                        activeTab === 'features' 
                          ? 'bg-indigo-500/20 text-indigo-400 shadow-inner border border-indigo-500/20' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      Features Access
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-4">
                    {activeTab === 'permissions' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {AVAILABLE_PERMISSIONS.map(perm => {
                          const isSelected = formData.permissions.includes(perm);
                          const meta = PERM_META[perm] || { 
                            label: perm.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 
                            desc: 'System permission', 
                            icon: Key 
                          };
                          const Icon = meta.icon;
                          
                          return (
                            <div 
                              key={perm}
                              onClick={() => togglePermission(perm)}
                              className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-indigo-500/10 border-indigo-500/30' 
                                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                              }`}
                            >
                              <div className={`mt-0.5 p-2 rounded-lg transition-colors ${isSelected ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 text-slate-400 group-hover:text-slate-300'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                                  {meta.label}
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1">{meta.desc}</div>
                              </div>
                              <div className={`w-10 h-5 mt-1 rounded-full relative transition-colors ${isSelected ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                <div className={`absolute top-0.5 bottom-0.5 w-4 bg-white rounded-full transition-all shadow-sm ${isSelected ? 'left-[22px]' : 'left-0.5'}`} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {AVAILABLE_FEATURES.map(feat => {
                          const isSelected = formData.features.includes(feat);
                          const meta = FEATURE_META[feat] || { 
                            label: feat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 
                            desc: 'System feature', 
                            icon: Star 
                          };
                          const Icon = meta.icon;

                          return (
                            <div 
                              key={feat}
                              onClick={() => toggleFeature(feat)}
                              className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-indigo-500/10 border-indigo-500/30' 
                                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                              }`}
                            >
                              <div className={`mt-0.5 p-2 rounded-lg transition-colors ${isSelected ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 text-slate-400 group-hover:text-slate-300'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                                  {meta.label}
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1">{meta.desc}</div>
                              </div>
                              <div className={`w-10 h-5 mt-1 rounded-full relative transition-colors ${isSelected ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                <div className={`absolute top-0.5 bottom-0.5 w-4 bg-white rounded-full transition-all shadow-sm ${isSelected ? 'left-[22px]' : 'left-0.5'}`} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20 flex gap-3 justify-end mt-auto">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="user-form"
                disabled={submitting}
                className={`btn-primary px-8 py-2.5 rounded-xl text-sm shadow-lg ${submitting ? 'opacity-70 cursor-wait' : 'shadow-indigo-500/25 hover:shadow-indigo-500/40'}`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    {editingUser ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {editingUser ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global styles specifically for this professional view that might not be in globals.css */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}

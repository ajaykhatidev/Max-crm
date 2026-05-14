'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Lead {
  id: string;
  title: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchLeads = async (pageNumber: number) => {
    setLoading(true);
    const token = localStorage.getItem('crm_token');
    try {
      const response = await fetch(`/api/leads?page=${pageNumber}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeads(page);
    }
  }, [page, user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <button onClick={() => router.push('/')} className="bg-none border-none text-[#6366f1] cursor-pointer mb-4 flex items-center gap-2 font-medium">
            ← Back to Dashboard
          </button>
          <h1 className="premium-gradient text-4xl font-extrabold m-0">Leads Management</h1>
        </div>
        <div className="glass-card mt-4 md:mt-0 px-4 py-2 text-sm font-medium">
          Total Pages: {totalPages}
        </div>
      </header>

      <div className="glass-card p-0 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white/3 border-b border-white/5">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="spinner w-8 h-8 mx-auto" />
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{lead.first_name || 'N/A'} {lead.last_name || ''}</div>
                      <div className="text-xs text-slate-400 font-normal">{lead.title}</div>
                    </td>
                    <td className="p-4 text-slate-300">{lead.email || 'N/A'}</td>
                    <td className="p-4 text-slate-300">{lead.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-col sm:flex-row justify-between items-center bg-white/2 gap-4">
          <button 
            disabled={page === 1 || loading} 
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-medium"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page <span className="text-white font-bold">{page}</span> of {totalPages}
          </span>
          <button 
            disabled={page === totalPages || loading} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

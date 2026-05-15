'use client';

import { useEffect, useMemo, useState } from 'react';
import { RefreshCcw, Search, Target } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';
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
  const [query, setQuery] = useState('');
  const { user, signOut } = useAuth();

  const fetchLeads = async (pageNumber: number) => {
    setLoading(true);
    const token = localStorage.getItem('crm_token');

    try {
      const response = await fetch(`/api/leads?page=${pageNumber}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setLeads(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      void (async () => {
        await fetchLeads(page);
      })();
    }
  }, [page, user]);

  const filteredLeads = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return leads;
    }

    return leads.filter((lead) =>
      [
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.phone,
        lead.status,
        lead.title,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [leads, query]);

  const newLeads = filteredLeads.filter((lead) => !lead.status || lead.status.toLowerCase() === 'new').length;
  const contactedLeads = filteredLeads.filter((lead) => lead.status?.toLowerCase().includes('contact')).length;

  return (
    <AuthGuard>
      <AppShell
        userName={user?.name || user?.email || 'Team Member'}
        eyebrow="Sales activity"
        title="Leads"
        description="A cleaner prospecting view with fast scanning, lighter tables, and clearer queue summaries for your team."
        onSignOut={signOut}
        action={
          <button
            type="button"
            onClick={() => fetchLeads(page)}
            className="flex items-center gap-2 rounded-full bg-[var(--surface-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f252d]"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh data
          </button>
        }
      >
        <section className="grid gap-6 md:grid-cols-3">
          {[
            ['Visible records', String(filteredLeads.length).padStart(2, '0'), 'In current page view'],
            ['New leads', String(newLeads).padStart(2, '0'), 'Require initial follow-up'],
            ['Contacted', String(contactedLeads).padStart(2, '0'), 'Already in motion'],
          ].map(([label, value, caption]) => (
            <article key={label} className="panel soft-ring rounded-[32px] p-8">
              <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--accent)] uppercase">{label}</p>
              <p className="font-display mt-4 text-5xl font-bold text-[var(--text)] tracking-tight">{value}</p>
              <p className="mt-3 text-sm font-medium text-[var(--muted)]">{caption}</p>
            </article>
          ))}
        </section>

        <section className="panel soft-ring rounded-[40px] p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--muted)] uppercase">
                Prospect queue
              </p>
              <h3 className="font-display mt-2 text-3xl font-bold text-[var(--text)] tracking-tight">Lead review table</h3>
            </div>

            <label className="group flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-slate-50 px-5 py-4 transition-all focus-within:border-[var(--accent)] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-indigo-50">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[var(--accent)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this page of leads"
                className="w-full min-w-[220px] bg-transparent text-sm font-medium text-[var(--text)] outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-10 overflow-hidden rounded-[32px] border border-[var(--line)] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-slate-50/50 text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase">
                    <th className="px-8 py-5">Prospect</th>
                    <th className="px-8 py-5">Contact</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="spinner mx-auto h-12 w-12" />
                      </td>
                    </tr>
                  ) : filteredLeads.length ? (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="group transition-colors hover:bg-slate-50/50">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]">
                              <Target className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[var(--text)] tracking-tight">
                                {[lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unnamed lead'}
                              </p>
                              <p className="mt-1 truncate text-xs font-medium text-[var(--muted)]">{lead.title || 'No title'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-[var(--text)] tracking-tight">{lead.email || '—'}</p>
                          <p className="mt-1 text-xs font-medium text-[var(--muted)]">{lead.phone || '—'}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-bold tracking-wider text-[var(--accent-strong)] uppercase">
                            {lead.status || 'New'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right text-xs font-bold text-[var(--muted)] tabular-nums">
                          {new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                          <Search className="h-8 w-8" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-[var(--muted)]">No leads found matching your search.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
            <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">
              Page <span className="text-[var(--text)]">{page}</span> / {totalPages}
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-2xl border border-[var(--line)] bg-white px-6 py-3 text-xs font-bold text-[var(--text)] tracking-widest uppercase transition hover:border-[var(--accent)] hover:shadow-lg hover:shadow-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page === totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-2xl bg-[var(--surface-dark)] px-6 py-3 text-xs font-bold text-white tracking-widest uppercase shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </AppShell>
    </AuthGuard>
  );
}

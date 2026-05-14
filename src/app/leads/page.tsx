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
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Visible records', String(filteredLeads.length).padStart(2, '0'), 'In current page view'],
            ['New leads', String(newLeads).padStart(2, '0'), 'Require initial follow-up'],
            ['Contacted', String(contactedLeads).padStart(2, '0'), 'Already in motion'],
          ].map(([label, value, caption]) => (
            <article key={label} className="panel soft-ring rounded-[28px] p-5">
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">{label}</p>
              <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{value}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{caption}</p>
            </article>
          ))}
        </section>

        <section className="panel-strong soft-ring rounded-[32px] p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                Prospect queue
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">Lead review table</h3>
            </div>

            <label className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-white/75 px-4 py-3">
              <Search className="h-4 w-4 text-[var(--muted)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this page of leads"
                className="w-full min-w-[180px] bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
            </label>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[28px] border border-[var(--line)] bg-white/72">
            <table className="min-w-full text-left">
              <thead className="border-b border-[var(--line)]">
                <tr className="text-sm text-[var(--muted)]">
                  <th className="px-5 py-4 font-semibold">Prospect</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center">
                      <div className="spinner mx-auto h-10 w-10" />
                    </td>
                  </tr>
                ) : filteredLeads.length ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-[var(--line)] last:border-b-0">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                            <Target className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text)]">
                              {[lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unnamed lead'}
                            </p>
                            <p className="mt-1 text-sm text-[var(--muted)]">{lead.title || 'No title added'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[var(--text)]">{lead.email || 'No email'}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{lead.phone || 'No phone number'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--muted)]">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center text-sm text-[var(--muted)]">
                      No leads match this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--muted)]">
              Page <span className="font-semibold text-[var(--text)]">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page === totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-full bg-[var(--surface-dark)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f252d] disabled:cursor-not-allowed disabled:opacity-40"
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

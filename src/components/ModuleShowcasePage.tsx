'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';
import FeatureSlider, { type SlideItem } from '@/components/FeatureSlider';
import { useAuth } from '@/context/AuthContext';

interface ModuleShowcasePageProps {
  title: string;
  eyebrow?: string;
  description?: string;
  actionLabel?: string;
  slides?: SlideItem[];
  stats: Array<{ label: string; value: string; caption: string }>;
  cards: Array<{ title: string; description: string; icon: LucideIcon }>;
  notes: string[];
}

export default function ModuleShowcasePage({
  title,
  eyebrow,
  description,
  actionLabel,
  slides = [],
  stats,
  cards,
  notes,
}: ModuleShowcasePageProps) {
  const { user, signOut } = useAuth();

  return (
    <AuthGuard>
      <AppShell
        userName={user?.name || user?.email || 'Team Member'}
        eyebrow={eyebrow}
        title={title}
        description={description}
        onSignOut={signOut}
        action={actionLabel ? <div className="panel rounded-full px-5 py-3 text-sm font-semibold text-[var(--accent-strong)]">{actionLabel}</div> : null}
      >
        <FeatureSlider slides={slides} />

        <section className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="panel soft-ring rounded-[32px] p-8">
              <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--accent)] uppercase">{stat.label}</p>
              <p className="font-display mt-4 text-5xl font-bold text-[var(--text)] tracking-tight">{stat.value}</p>
              <p className="mt-3 text-sm font-medium text-[var(--muted)]">{stat.caption}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="panel soft-ring rounded-[40px] p-8 md:p-10">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--muted)] uppercase">
                  Workspace blocks
                </p>
                <h3 className="font-display mt-1 text-3xl font-bold text-[var(--text)] tracking-tight">Professional module layout</h3>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.title} className="group rounded-[32px] border border-[var(--line)] bg-white p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-xl hover:shadow-indigo-50">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[var(--muted)] transition-colors group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4 className="mt-6 text-xl font-bold text-[var(--text)] tracking-tight">{card.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <article className="panel soft-ring rounded-[40px] p-8 md:p-10">
            <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--muted)] uppercase">
              Suggested operating flow
            </p>
            <div className="mt-8 space-y-4">
              {notes.map((note) => (
                <div key={note} className="flex items-start gap-4 rounded-3xl border border-[var(--line)] bg-white/50 px-5 py-5 transition-all hover:bg-white">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-[var(--text)]">{note}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </AppShell>
    </AuthGuard>
  );
}

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

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="panel soft-ring rounded-[28px] p-5">
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{stat.value}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{stat.caption}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="panel-strong soft-ring rounded-[32px] p-6 md:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                  Workspace blocks
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-[var(--text)]">Professional module layout</h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.title} className="rounded-[26px] border border-[var(--line)] bg-white/65 p-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ed] text-[var(--warn)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4 className="mt-5 text-lg font-semibold text-[var(--text)]">{card.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <article className="panel-strong soft-ring rounded-[32px] p-6">
            <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
              Suggested operating flow
            </p>
            <div className="mt-5 space-y-3">
              {notes.map((note) => (
                <div key={note} className="flex items-start gap-3 rounded-[22px] border border-[var(--line)] bg-white/65 px-4 py-4">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <p className="text-sm leading-6 text-[var(--text)]">{note}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </AppShell>
    </AuthGuard>
  );
}

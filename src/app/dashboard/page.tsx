'use client';

import Link from 'next/link';
import {
  Boxes,
  ChartNoAxesColumn,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';
import FeatureSlider from '@/components/FeatureSlider';
import { useAuth } from '@/context/AuthContext';

const moduleCards = [
  {
    href: '/leads',
    title: 'Lead pipeline',
    description: 'Review qualification, routing, and momentum across the sales funnel.',
    icon: Target,
  },
  {
    href: '/inventory',
    title: 'Inventory health',
    description: 'Track premium units, launch cadence, and availability pressure.',
    icon: Boxes,
  },
  {
    href: '/users',
    title: 'Team access',
    description: 'Control roles, features, and permissions for every operator.',
    icon: Users,
  },
  {
    href: '/administrators',
    title: 'Admin control',
    description: 'Centralize policies, escalations, and governance workflows.',
    icon: ShieldCheck,
  },
];

const slides = [
  {
    eyebrow: 'Pipeline focus',
    title: 'Move high intent prospects faster.',
    description:
      'A cleaner sales cockpit helps your team spot priority leads, respond faster, and reduce friction between qualification and action.',
    metric: '31%',
    caption: 'Average lift in response speed when queues are visibly prioritized.',
  },
  {
    eyebrow: 'Operations clarity',
    title: 'Keep stock, people, and decisions in one view.',
    description:
      'The redesigned workspace turns scattered admin tasks into a coordinated operating rhythm with visible ownership.',
    metric: '4 hubs',
    caption: 'Core business areas now sit inside one consistent navigation system.',
  },
  {
    eyebrow: 'Executive polish',
    title: 'Present a system your team can trust.',
    description:
      'The new interface is calmer, sharper, and easier to scan, so the product feels production-ready in client and internal demos.',
    metric: '100%',
    caption: 'Unified visual language applied across the project.',
  },
];

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <AuthGuard>
      <AppShell
        userName={user?.name || user?.email || 'Team Member'}
        eyebrow="Daily overview"
        title="Dashboard"
        onSignOut={signOut}
      >
        <FeatureSlider slides={slides} />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Qualified leads', '128', 'This week'],
            ['Inventory alerts', '07', 'Need action'],
            ['Active operators', '24', 'Across all roles'],
            ['Pending reviews', '12', 'Awaiting approval'],
          ].map(([label, value, caption], index) => (
            <article
              key={label}
              className="panel soft-ring animated-rise rounded-[32px] p-8"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--accent)] uppercase">
                {label}
              </p>
              <p className="font-display mt-4 text-5xl font-bold text-[var(--text)] tracking-tight">{value}</p>
              <p className="mt-3 text-sm font-medium text-[var(--muted)]">{caption}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="panel soft-ring rounded-[40px] p-8 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--muted)] uppercase">
                  Work areas
                </p>
                <h3 className="font-display mt-2 text-3xl font-bold text-[var(--text)] tracking-tight">Core CRM modules</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--accent)]">
                <ChartNoAxesColumn className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {moduleCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group rounded-[32px] border border-[var(--line)] bg-white p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-xl hover:shadow-indigo-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[var(--muted)] transition-colors group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:text-[var(--accent)] group-hover:translate-x-1" />
                    </div>
                    <h4 className="mt-6 text-xl font-bold text-[var(--text)] tracking-tight">{card.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{card.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <article className="panel soft-ring rounded-[40px] p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--muted)] uppercase">
                    Focus today
                  </p>
                  <h3 className="font-display mt-1 text-2xl font-bold text-[var(--text)] tracking-tight">Daily actions</h3>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  'Clean the oldest unassigned leads before noon.',
                  'Review low-stock projects approaching weekend campaigns.',
                  'Confirm admin permissions for new onboarding users.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-[var(--line)] bg-slate-50/50 px-5 py-4 text-sm font-medium text-[var(--text)] transition-colors hover:bg-slate-50">
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="panel soft-ring rounded-[40px] p-8">
              <p className="text-[10px] font-bold tracking-[0.24em] text-[var(--muted)] uppercase">
                Recent movement
              </p>
              <div className="mt-8 space-y-4">
                {[
                  ['Lead imported', '31 new records synced from campaign intake.'],
                  ['Inventory updated', 'Palm Heights inventory status refreshed 8 minutes ago.'],
                  ['User access changed', 'Permissions adjusted for 2 coordinators.'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl border border-[var(--line)] bg-slate-50/50 px-5 py-5 transition-all hover:bg-white">
                    <p className="text-sm font-bold text-[var(--text)] tracking-tight">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </AppShell>
    </AuthGuard>
  );
}

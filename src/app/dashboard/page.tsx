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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Qualified leads', '128', 'This week'],
            ['Inventory alerts', '07', 'Need action'],
            ['Active operators', '24', 'Across all roles'],
            ['Pending reviews', '12', 'Awaiting approval'],
          ].map(([label, value, caption], index) => (
            <article
              key={label}
              className="panel soft-ring animated-rise rounded-[28px] p-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                {label}
              </p>
              <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{value}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{caption}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="panel-strong soft-ring rounded-[32px] p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                  Work areas
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[var(--text)]">Core CRM modules</h3>
              </div>
              <ChartNoAxesColumn className="h-5 w-5 text-[var(--accent)]" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {moduleCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group rounded-[26px] border border-[var(--line)] bg-white/60 p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white/80"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ChevronRight className="h-5 w-5 text-[var(--muted)] transition group-hover:text-[var(--accent)]" />
                    </div>
                    <h4 className="mt-6 text-lg font-semibold text-[var(--text)]">{card.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <article className="panel-strong soft-ring rounded-[32px] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1df] text-[var(--warn)]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                    Focus today
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[var(--text)]">3 launch-critical actions</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  'Clean the oldest unassigned leads before noon.',
                  'Review low-stock projects approaching weekend campaigns.',
                  'Confirm admin permissions for new onboarding users.',
                ].map((item) => (
                  <div key={item} className="rounded-[22px] border border-[var(--line)] bg-white/65 px-4 py-4 text-sm text-[var(--text)]">
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-strong soft-ring rounded-[32px] p-6">
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                Recent movement
              </p>
              <div className="mt-5 space-y-4">
                {[
                  ['Lead imported', '31 new records synced from campaign intake.'],
                  ['Inventory updated', 'Palm Heights inventory status refreshed 8 minutes ago.'],
                  ['User access changed', 'Permissions adjusted for 2 coordinators.'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-[22px] border border-[var(--line)] bg-white/65 px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
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

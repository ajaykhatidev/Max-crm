'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Boxes,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Users,
} from 'lucide-react';

type AppShellProps = {
  userName: string;
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  onSignOut?: () => void;
  action?: React.ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: ArrowRight },
  { href: '/inventory', label: 'Inventory', icon: Boxes },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/administrators', label: 'Admin', icon: ShieldCheck },
];

export default function AppShell({
  userName,
  title,
  eyebrow,
  description,
  children,
  onSignOut,
  action,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="page-shell">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 md:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="panel-strong soft-ring hidden rounded-[34px] p-6 lg:flex lg:flex-col">
          <div className="hero-mesh rounded-[24px] border border-white/40 px-5 py-4">
            <p className="text-[10px] font-bold tracking-[0.3em] text-[var(--muted)] uppercase">
              Maxpine CRM
            </p>
          </div>

          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[22px] border px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                      : 'border-transparent text-[var(--text)] hover:border-[var(--line)] hover:bg-white/55'
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/65">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[28px] bg-[var(--surface-dark)] p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-base font-bold">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs tracking-[0.2em] text-white/60 uppercase">Active session</p>
              </div>
            </div>

            {onSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/14"
              >
                <Settings2 className="h-4 w-4" />
                Sign out
              </button>
            ) : null}
          </div>
        </aside>

        <main className="min-w-0">
          <header className="panel-strong soft-ring animated-rise rounded-[34px] p-5 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="text-xs font-semibold tracking-[0.28em] text-[var(--muted)] uppercase">
                    {eyebrow}
                  </p>
                )}
                <h2 className="font-display mt-3 text-4xl leading-none text-[var(--text)] md:text-5xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] md:text-base">
                    {description}
                  </p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                        : 'border-[var(--line)] bg-white/55 text-[var(--text)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className="mt-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

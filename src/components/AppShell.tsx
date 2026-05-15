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
      <div className="mx-auto grid min-h-screen max-w-[1700px] gap-8 px-5 py-6 md:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
        <aside className="panel soft-ring hidden flex-col rounded-[32px] p-6 lg:flex">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <p className="font-display text-lg font-bold tracking-tight text-[var(--text)]">
              Maxpine
            </p>
          </div>

          <nav className="grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[var(--accent)] text-white shadow-lg shadow-indigo-200'
                      : 'text-[var(--muted)] hover:bg-[var(--bg-strong)] hover:text-[var(--text)]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-[var(--muted)]'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl bg-[var(--surface-dark)] p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{userName}</p>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Active</p>
              </div>
            </div>

            {onSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold transition hover:bg-white/10"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Sign out
              </button>
            ) : null}
          </div>
        </aside>

        <main className="min-w-0">
          <header className="panel soft-ring animated-rise rounded-[32px] p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="text-[10px] font-bold tracking-[0.3em] text-[var(--accent)] uppercase">
                    {eyebrow}
                  </p>
                )}
                <h2 className="font-display mt-2 text-4xl font-bold tracking-tight text-[var(--text)] md:text-5xl lg:text-6xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {description}
                  </p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
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
                        : 'border-[var(--line)] bg-white text-[var(--text)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className="mt-8 space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

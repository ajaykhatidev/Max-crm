'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-6">
        <div className="panel-strong soft-ring flex min-h-[220px] w-full max-w-md flex-col items-center justify-center rounded-[32px] px-8 text-center">
          <div className="spinner h-12 w-12" />
          <p className="mt-6 text-sm font-medium tracking-[0.24em] text-[var(--muted)] uppercase">
            Preparing workspace
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            We&apos;re loading your CRM command center.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

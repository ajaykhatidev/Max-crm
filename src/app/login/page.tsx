'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import FeatureSlider from '@/components/FeatureSlider';
import { useAuth } from '@/context/AuthContext';

const slides = [
  {
    eyebrow: 'Pipeline intelligence',
    title: 'A calmer CRM for sharper selling.',
    description:
      'Track demand, prioritize follow-up, and keep your team aligned inside one professional command center.',
    metric: '24/7',
    caption: 'Always-on visibility for leads, stock, and operator activity.',
  },
  {
    eyebrow: 'Premium operations',
    title: 'Built for enterprise-grade coordination.',
    description:
      'From role-based access to stock awareness, each screen is designed to reduce noise and surface decisions.',
    metric: '5 zones',
    caption: 'Unified workspace across dashboard, leads, people, inventory, and admin.',
  },
  {
    eyebrow: 'Executive-ready design',
    title: 'A system that looks as serious as the work.',
    description:
      'The new visual language brings clarity, polish, and trust from the first sign-in onward.',
    metric: '1 platform',
    caption: 'Consistent design system applied throughout the project.',
  },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-6 md:px-6">
      <div className="grid w-full max-w-[1480px] gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <section className="panel-strong soft-ring animated-rise rounded-[36px] overflow-hidden">
          <div className="hero-mesh h-full p-7 md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-dark)] text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                  Maxpine CRM
                </p>
                <p className="text-sm text-[var(--muted)]">Sales and operations command center</p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-xs font-semibold tracking-[0.28em] text-[var(--muted)] uppercase">
                Authorized access
              </p>
              <h1 className="font-display mt-4 text-5xl leading-none text-[var(--text)] md:text-6xl">
                Sign in to your
                <span className="accent-text block">professional workspace</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">
                Review high-intent leads, manage inventory, and coordinate your team from a single premium interface.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ['Faster review', 'Clearer summaries and queues'],
                ['Secure access', 'Controlled operator roles'],
                ['Daily visibility', 'Unified activity view'],
              ].map(([title, caption]) => (
                <div key={title} className="rounded-[24px] border border-white/50 bg-white/55 p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{caption}</p>
                </div>
              ))}
            </div>

            <FeatureSlider slides={slides} className="mt-8" />
          </div>
        </section>

        <section className="panel-strong soft-ring animated-rise rounded-[36px] p-6 md:p-10" style={{ animationDelay: '120ms' }}>
          <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-[var(--muted)] uppercase">
                Welcome back
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--text)] md:text-4xl">
                Access your dashboard
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Use your assigned company credentials to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Email address</span>
                <span className="flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-white/70 px-4 py-4">
                  <Mail className="h-4 w-4 text-[var(--muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@maxpine.com"
                    required
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Password</span>
                <span className="flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-white/70 px-4 py-4">
                  <LockKeyhole className="h-4 w-4 text-[var(--muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-[var(--muted)] transition hover:text-[var(--accent)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              {error ? (
                <div className="rounded-[22px] border border-[#e7b7ab] bg-[#fff1ee] px-4 py-4 text-sm text-[#93442f]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--surface-dark)] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#0f252d] disabled:cursor-not-allowed disabled:opacity-75"
              >
                {loading ? <div className="spinner h-5 w-5 border-white/20 border-t-white" /> : <ArrowRight className="h-4 w-4" />}
                {loading ? 'Authenticating' : 'Continue to workspace'}
              </button>
            </form>

            <div className="mt-10 rounded-[28px] border border-[var(--line)] bg-white/58 p-5">
              <p className="text-xs font-semibold tracking-[0.24em] text-[var(--muted)] uppercase">
                Security notice
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                This environment is restricted to approved Maxpine operators and administrators.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

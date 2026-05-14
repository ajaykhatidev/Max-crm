'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PlaceholderPage({ title, icon, color }: { title: string, icon: string, color: string }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading || !user) return <div className="spinner w-12 h-12 m-auto mt-20" />;

  return (
    <div className="container px-4 py-8">
      <header className="mb-10">
        <button onClick={() => router.push('/')} className="text-[#6366f1] mb-4 flex items-center gap-2 font-medium">
          ← Back to Dashboard
        </button>
        <h1 className="premium-gradient text-4xl font-extrabold m-0">{title}</h1>
      </header>

      <div className="glass-card flex flex-col items-center justify-center p-20 text-center border-white/5">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6" style={{ background: `${color}20`, color: color }}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title} Module</h2>
        <p className="text-slate-400 max-w-md">
          This section is currently under development. Soon you will be able to manage all {title.toLowerCase()} from this professional glassmorphic interface.
        </p>
      </div>
    </div>
  );
}

'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const DashboardCard = ({ title, subtitle, icon, color, delay, onClick }: { title: string, subtitle: string, icon: string, color: string, delay: string, onClick?: () => void }) => (
  <div className="glass-card animate-fade-in flex flex-col gap-4 border-white/5 cursor-pointer" 
  onClick={onClick}
  style={{ 
    animationDelay: delay,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.borderColor = color;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
  }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ 
      background: `${color}20`, 
      color: color
    }}>
      {icon}
    </div>
    <div>
      <h3 className="m-0 text-xl font-bold">{title}</h3>
      <p className="m-1 text-slate-400 text-sm">{subtitle}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <header className="animate-fade-in flex flex-col md:flex-row justify-between items-center mb-16 p-6 bg-white/2 rounded-[20px] border border-white/5">
        <div>
          <h1 className="premium-gradient text-3xl font-extrabold m-0">Maxpine CRM</h1>
          <p className="text-slate-400 mt-2">Welcome back, <span className="text-white font-medium">{user.name || user.email}</span></p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="btn-primary bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-2.5" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 opacity-80">Administrative Overview</h2>
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="Leads Management" 
            subtitle="Track and manage potential clients" 
            icon="🎯" 
            color="#6366f1" 
            delay="0.1s" 
            onClick={() => router.push('/leads')}
          />
          <DashboardCard 
            title="Inventory" 
            subtitle="Stock and unit availability" 
            icon="📦" 
            color="#10b981" 
            delay="0.2s" 
            onClick={() => router.push('/inventory')}
          />
          <DashboardCard 
            title="Users" 
            subtitle="Manage team members" 
            icon="👥" 
            color="#f59e0b" 
            delay="0.3s" 
            onClick={() => router.push('/users')}
          />
          <DashboardCard 
            title="Administrators" 
            subtitle="System level configurations" 
            icon="🛡️" 
            color="#ec4899" 
            delay="0.4s" 
            onClick={() => router.push('/administrators')}
          />
        </main>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 opacity-80">System Activity</h2>
        <div className="glass-card p-10 text-center text-slate-400">
          <p>Real-time activity logs will appear here as the system processes new data.</p>
        </div>
      </div>
    </div>
  );
}

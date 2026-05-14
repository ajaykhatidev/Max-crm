'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      background: 'radial-gradient(circle at top right, #1a1a2e, #16213e, #0f3460)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full" style={{
        background: 'rgba(99, 102, 241, 0.1)',
        filter: 'blur(100px)'
      }} />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full" style={{
        background: 'rgba(168, 85, 247, 0.1)',
        filter: 'blur(120px)'
      }} />

      <div className="glass-card animate-fade-in w-full max-w-[420px] p-10 relative z-10" style={{ 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div className="text-center mb-10">
          <h1 className="premium-gradient text-4xl font-extrabold tracking-tight">
            Max CRM
          </h1>
          <p className="text-white/50 mt-2">
            Enterprise Resource Planning
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-white/70 text-sm">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@maxpine.com"
              required
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#6366f1] transition-all"
            />
          </div>
          
          <div className="relative">
            <label className="block mb-2 text-white/70 text-sm">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3.5 pr-12 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#6366f1] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-white/30 text-xl"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="flex justify-end">
            <span className="text-[#6366f1] text-xs cursor-pointer opacity-80">
              Forgot password?
            </span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button 
            className="btn-primary mt-4 w-full" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner w-5 h-5" />
                Authenticating...
              </>
            ) : 'Sign In to Portal'}
          </button>
        </form>

        <p className="text-center mt-8 text-white/40 text-sm">
          Secure system access restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}

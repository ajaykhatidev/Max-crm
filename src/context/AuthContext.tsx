'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  user_id?: string;
  email: string;
  name: string;
  role: string;
  last_seen?: string;
  permissions?: string[];
  status?: string;
  profile_image?: string;
  organization_id?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('crm_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            const userData = {
              ...data.user,
              id: data.user.user_id || data.user.id
            };
            setUser(userData);
          } else {
            localStorage.removeItem('crm_token');
          }
        } else {
          localStorage.removeItem('crm_token');
        }
      } catch (err) {
        console.error('Session verification failed', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('crm_token', data.token);
    const userData = {
      ...data.user,
      id: data.user.user_id || data.user.id
    };
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('crm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

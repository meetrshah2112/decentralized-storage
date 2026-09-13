import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await authApi.me();
      setUser(data.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (username, email, password, password2) => {
    return authApi.register(username, email, password, password2);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout — clear local session regardless
    }
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const data = await authApi.me();
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

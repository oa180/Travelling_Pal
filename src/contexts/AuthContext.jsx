import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthAPI } from "@/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "auth_token";

export const ROLE = {
  ADMIN: "ADMIN",
  COMPANY: "COMPANY",
  TRAVELER: "TRAVELER",
};

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token, remember = true) {
  try {
    // Clear both storages first
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (token) {
      if (remember) localStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => readToken(), [/* changes via login/logout */]);

  const loadMe = useCallback(async () => {
    try {
      const me = await AuthAPI.me();
      setUser(me);
      return me;
    } catch (e) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // On mount, if token exists try to hydrate the session
    if (readToken()) {
      loadMe();
    } else {
      setLoading(false);
    }
  }, [loadMe]);

  const login = useCallback(async ({ email, mobile, password, remember = true }) => {
    const res = await AuthAPI.login({ email, mobile, password });
    // Expect token in res.token or res.accessToken
    const tok = res?.token || res?.accessToken;
    if (tok) writeToken(tok, remember);
    const me = await loadMe();
    return me || res;
  }, [loadMe]);

  const signup = useCallback(async ({ email, mobile, password, role = ROLE.TRAVELER, remember = true }) => {
    const res = await AuthAPI.signup({ email, mobile, password, role });
    const tok = res?.token || res?.accessToken;
    if (tok) writeToken(tok, remember);
    const me = await loadMe();
    return me || res;
  }, [loadMe]);

  const logout = useCallback(async () => {
    try { await AuthAPI.logout(); } catch {}
    writeToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    loadMe,
  }), [user, loading, login, signup, logout, loadMe]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

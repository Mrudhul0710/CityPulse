import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth.api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "citypulse_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    // A token in storage doesn't mean it's still valid -- confirm with /me.
    authApi
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials) {
    const { user, token } = await authApi.login(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
    return user;
  }

  async function register(payload) {
    const { user, token } = await authApi.register(payload);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

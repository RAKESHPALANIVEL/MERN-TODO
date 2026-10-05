import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, getMe } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Restore the session on page refresh
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (user) return; // already signed in (just logged in)
    getMe()
      .then((res) => setUser(res.data.user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [token, user, logout]);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

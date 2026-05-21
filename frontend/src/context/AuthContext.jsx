import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the context
const AuthContext = createContext();

// AuthProvider wraps our entire app
// Every component inside can access auth data
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ─── REGISTER ───────────────────────────────────────────
  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password });
    const data = response.data;

    // Save token and user to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
    }));

    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  // ─── LOGIN ──────────────────────────────────────────────
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const data = response.data;

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
    }));

    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  // ─── LOGOUT ─────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);
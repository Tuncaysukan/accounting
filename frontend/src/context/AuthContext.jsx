import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(() => {
    const stored = localStorage.getItem('kullanici');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = useCallback(async (kullanici_adi, sifre) => {
    const res = await axios.post('/api/auth/login', { kullanici_adi, sifre });
    const { token: yeniToken, kullanici: yeniKullanici } = res.data;

    localStorage.setItem('token', yeniToken);
    localStorage.setItem('kullanici', JSON.stringify(yeniKullanici));

    axios.defaults.headers.common['Authorization'] = `Bearer ${yeniToken}`;

    setToken(yeniToken);
    setKullanici(yeniKullanici);

    return yeniKullanici;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setKullanici(null);
  }, []);

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return (
    <AuthContext.Provider value={{ kullanici, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider içinde kullanılmalı');
  return ctx;
}

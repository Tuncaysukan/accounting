import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:3000/api';

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Token değiştiğinde axios default header'ını güncelle
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Sayfa yüklendiğinde token'ı kontrol et
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKullanici(response.data);
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      setToken(null);
      setKullanici(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (kullanici_adi, sifre) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      kullanici_adi,
      sifre
    });

    const { token: newToken, user: userData } = response.data;
    setToken(newToken);
    setKullanici(userData);
    return userData;
  };

  const logout = () => {
    setToken(null);
    setKullanici(null);
  };

  const changePassword = async (eski_sifre, yeni_sifre) => {
    const response = await axios.post(`${API_URL}/auth/change-password`, {
      eski_sifre,
      yeni_sifre
    });
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ kullanici, token, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const DEMO_ACCOUNTS = [
  { label: 'Admin', kullanici_adi: 'admin', sifre: 'admin123' },
  { label: 'Muhasebe', kullanici_adi: 'muhasebe', sifre: 'muhasebe123' },
  { label: 'Stok', kullanici_adi: 'stok', sifre: 'stok123' },
  { label: 'İK', kullanici_adi: 'ik', sifre: 'ik123' },
];

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ kullanici_adi: '', sifre: '' });
  const [sifreGoster, setSifreGoster] = useState(false);
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (hata) setHata('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.kullanici_adi.trim() || !form.sifre.trim()) {
      setHata('Lütfen tüm alanları doldurun.');
      return;
    }

    setYukleniyor(true);
    setHata('');

    try {
      await login(form.kullanici_adi, form.sifre);
      navigate('/');
    } catch (err) {
      setHata(err.response?.data?.error || 'Giriş yapılamadı, tekrar deneyin.');
    } finally {
      setYukleniyor(false);
    }
  };

  const demoGiris = (hesap) => {
    setForm({ kullanici_adi: hesap.kullanici_adi, sifre: hesap.sifre });
    setHata('');
  };

  return (
    <div className="login-page">
      {/* Sol panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <i className="bi bi-building"></i>
          </div>
          <h1>Yönetim Sistemi</h1>
          <p>Stok, muhasebe ve personel işlemlerinizi tek platformda yönetin.</p>
          <div className="login-features">
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              Gerçek zamanlı stok takibi
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              Fatura ve irsaliye yönetimi
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              Personel ve bordro işlemleri
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              Detaylı finansal raporlar
            </div>
          </div>
        </div>
      </div>

      {/* Sağ panel */}
      <div className="login-right">
        <div className="login-form-header">
          <h2>Hoş Geldiniz</h2>
          <p>Devam etmek için hesabınıza giriş yapın.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {hata && (
            <div className="login-error">
              <i className="bi bi-exclamation-circle-fill"></i>
              {hata}
            </div>
          )}

          <div className="login-field">
            <label htmlFor="kullanici_adi">Kullanıcı Adı</label>
            <div className="login-input-wrapper">
              <i className="bi bi-person login-input-icon"></i>
              <input
                id="kullanici_adi"
                name="kullanici_adi"
                type="text"
                autoComplete="username"
                placeholder="kullanici_adi"
                value={form.kullanici_adi}
                onChange={handleChange}
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="sifre">Şifre</label>
            <div className="login-input-wrapper">
              <i className="bi bi-lock login-input-icon"></i>
              <input
                id="sifre"
                name="sifre"
                type={sifreGoster ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.sifre}
                onChange={handleChange}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setSifreGoster((v) => !v)}
                aria-label={sifreGoster ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <i className={`bi ${sifreGoster ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={yukleniyor}>
            {yukleniyor ? (
              <>
                <span className="login-spinner"></span>
                Giriş yapılıyor…
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                Giriş Yap
              </>
            )}
          </button>
        </form>

        <div className="login-demo">
          <div className="login-demo-title">Demo Hesaplar</div>
          <div className="login-demo-accounts">
            {DEMO_ACCOUNTS.map((h) => (
              <button
                key={h.kullanici_adi}
                type="button"
                className="login-demo-btn"
                onClick={() => demoGiris(h)}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">© 2024 Yönetim Sistemi</div>
      </div>
    </div>
  );
}

export default Login;

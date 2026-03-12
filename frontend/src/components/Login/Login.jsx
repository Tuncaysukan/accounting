import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ kullanici_adi: '', sifre: '' });
  const [sifreGoster, setSifreGoster] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.kullanici_adi.trim() || !form.sifre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm alanları doldurun.',
        confirmButtonText: 'Tamam'
      });
      return;
    }

    setYukleniyor(true);

    try {
      await login(form.kullanici_adi, form.sifre);
      
      Swal.fire({
        icon: 'success',
        title: 'Giriş Başarılı!',
        text: 'Yönlendiriliyorsunuz...',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Giriş yapılamadı, tekrar deneyin.';
      
      Swal.fire({
        icon: 'error',
        title: 'Giriş Başarısız',
        text: errorMessage,
        confirmButtonText: 'Tekrar Dene'
      });
    } finally {
      setYukleniyor(false);
    }
  };

  const demoGiris = (kullanici_adi, sifre) => {
    setForm({ kullanici_adi, sifre });
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
            <button
              type="button"
              className="login-demo-btn"
              onClick={() => demoGiris('admin', 'admin123')}
            >
              Admin
            </button>
            <button
              type="button"
              className="login-demo-btn"
              onClick={() => demoGiris('muhasebe', 'muhasebe123')}
            >
              Muhasebe
            </button>
            <button
              type="button"
              className="login-demo-btn"
              onClick={() => demoGiris('stok', 'stok123')}
            >
              Stok
            </button>
            <button
              type="button"
              className="login-demo-btn"
              onClick={() => demoGiris('ik', 'ik123')}
            >
              İK
            </button>
          </div>
        </div>

        <div className="login-footer">© 2024 Yönetim Sistemi</div>
      </div>
    </div>
  );
}

export default Login;

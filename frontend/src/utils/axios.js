import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Token geçersiz veya süresi dolmuş
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        
        Swal.fire({
          icon: 'warning',
          title: 'Oturum Süresi Doldu',
          text: 'Lütfen tekrar giriş yapın.',
          confirmButtonText: 'Tamam'
        });
      }
      // Sunucu hatası
      else if (status >= 500) {
        Swal.fire({
          icon: 'error',
          title: 'Sunucu Hatası',
          text: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
          confirmButtonText: 'Tamam'
        });
      }
      // Diğer hatalar
      else if (data?.error) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: data.error,
          confirmButtonText: 'Tamam'
        });
      }
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      Swal.fire({
        icon: 'error',
        title: 'Bağlantı Hatası',
        text: 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.',
        confirmButtonText: 'Tamam'
      });
    }

    return Promise.reject(error);
  }
);

export default api;

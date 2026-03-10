import { useState, useEffect } from 'react';
import axios from 'axios';

function Personel() {
  const [personeller, setPersoneller] = useState([]);
  const [izinler, setIzinler] = useState([]);
  const [vardiyalar, setVardiyalar] = useState([]);
  const [activeTab, setActiveTab] = useState('liste');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [personelRes, izinRes, vardiyaRes] = await Promise.all([
        axios.get('http://localhost:3000/api/personel'),
        axios.get('http://localhost:3000/api/personel/izinler'),
        axios.get('http://localhost:3000/api/personel/vardiyalar')
      ]);
      setPersoneller(personelRes.data);
      setIzinler(izinRes.data);
      setVardiyalar(vardiyaRes.data);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-12">
          <h2>Personel Yönetimi</h2>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs" role="tablist">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'liste' ? 'active' : ''}`}
                href="#"
                onClick={() => setActiveTab('liste')}
              >
                Personel Listesi
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'izinler' ? 'active' : ''}`}
                href="#"
                onClick={() => setActiveTab('izinler')}
              >
                İzinler
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'vardiyalar' ? 'active' : ''}`}
                href="#"
                onClick={() => setActiveTab('vardiyalar')}
              >
                Vardiyalar
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'bordro' ? 'active' : ''}`}
                href="#"
                onClick={() => setActiveTab('bordro')}
              >
                Bordro
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : activeTab === 'liste' ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Ad Soyad</th>
                    <th>Pozisyon</th>
                    <th>Telefon</th>
                    <th>Email</th>
                    <th>Maaş</th>
                  </tr>
                </thead>
                <tbody>
                  {personeller.map(personel => (
                    <tr key={personel.id}>
                      <td>{personel.ad} {personel.soyad}</td>
                      <td>{personel.pozisyon}</td>
                      <td>{personel.telefon}</td>
                      <td>{personel.email}</td>
                      <td>{personel.maas} TL</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'izinler' ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Personel</th>
                    <th>İzin Tipi</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                  </tr>
                </thead>
                <tbody>
                  {izinler.map(izin => (
                    <tr key={izin.id}>
                      <td>{izin.ad} {izin.soyad}</td>
                      <td>
                        <span className="badge text-bg-info">{izin.izin_tipi}</span>
                      </td>
                      <td>{new Date(izin.baslangic_tarihi).toLocaleDateString('tr-TR')}</td>
                      <td>{new Date(izin.bitis_tarihi).toLocaleDateString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'vardiyalar' ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Personel</th>
                    <th>Tarih</th>
                    <th>Vardiya</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                  </tr>
                </thead>
                <tbody>
                  {vardiyalar.map(vardiya => (
                    <tr key={vardiya.id}>
                      <td>{vardiya.ad} {vardiya.soyad}</td>
                      <td>{new Date(vardiya.tarih).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <span className="badge text-bg-warning">{vardiya.vardiya_tipi}</span>
                      </td>
                      <td>{vardiya.baslangic_saati}</td>
                      <td>{vardiya.bitis_saati}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              Bordro modülü yakında eklenecektir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Personel;

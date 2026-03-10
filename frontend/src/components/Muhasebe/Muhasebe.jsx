import { useState, useEffect } from 'react';
import axios from 'axios';

function Muhasebe() {
  const [faturalar, setFaturalar] = useState([]);
  const [irsaliyeler, setIrsaliyeler] = useState([]);
  const [activeTab, setActiveTab] = useState('faturalar');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fatura_no: '',
    musteri_adi: '',
    tutar: '',
    fatura_tipi: 'satis'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [faturaRes, irsaliyeRes] = await Promise.all([
        axios.get('http://localhost:3000/api/muhasebe/faturalar'),
        axios.get('http://localhost:3000/api/muhasebe/irsaliyeler')
      ]);
      setFaturalar(faturaRes.data);
      setIrsaliyeler(irsaliyeRes.data);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/muhasebe/faturalar', formData);
      setFormData({ fatura_no: '', musteri_adi: '', tutar: '', fatura_tipi: 'satis' });
      fetchData();
      alert('Fatura başarıyla oluşturuldu');
    } catch (error) {
      console.error('Fatura oluşturulamadı:', error);
      alert('Fatura oluşturulurken hata oluştu');
    }
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-12">
          <h2>Muhasebe Yönetimi</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Yeni Fatura</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Fatura No</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fatura_no"
                    value={formData.fatura_no}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Müşteri Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    name="musteri_adi"
                    value={formData.musteri_adi}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tutar</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tutar"
                    value={formData.tutar}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fatura Tipi</label>
                  <select
                    className="form-control"
                    name="fatura_tipi"
                    value={formData.fatura_tipi}
                    onChange={handleInputChange}
                  >
                    <option value="satis">Satış</option>
                    <option value="alis">Alış</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Oluştur
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'faturalar' ? 'active' : ''}`}
                    href="#"
                    onClick={() => setActiveTab('faturalar')}
                  >
                    Faturalar
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'irsaliyeler' ? 'active' : ''}`}
                    href="#"
                    onClick={() => setActiveTab('irsaliyeler')}
                  >
                    İrsaliyeler
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Yükleniyor...</p>
              ) : activeTab === 'faturalar' ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Fatura No</th>
                        <th>Müşteri</th>
                        <th>Tutar</th>
                        <th>Tip</th>
                        <th>Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faturalar.map(fatura => (
                        <tr key={fatura.id}>
                          <td>{fatura.fatura_no}</td>
                          <td>{fatura.musteri_adi}</td>
                          <td>{fatura.tutar} TL</td>
                          <td>
                            <span className={`badge ${fatura.fatura_tipi === 'satis' ? 'text-bg-success' : 'text-bg-info'}`}>
                              {fatura.fatura_tipi === 'satis' ? 'Satış' : 'Alış'}
                            </span>
                          </td>
                          <td>{new Date(fatura.tarih).toLocaleDateString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>İrsaliye No</th>
                        <th>Müşteri</th>
                        <th>Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {irsaliyeler.map(irsaliye => (
                        <tr key={irsaliye.id}>
                          <td>{irsaliye.irsaliye_no}</td>
                          <td>{irsaliye.musteri_adi}</td>
                          <td>{new Date(irsaliye.tarih).toLocaleDateString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Muhasebe;

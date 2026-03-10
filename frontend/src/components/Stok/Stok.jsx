import { useState, useEffect } from 'react';
import axios from 'axios';

function Stok() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    urun_adi: '',
    stok_miktari: '',
    birim: 'Adet',
    min_stok: ''
  });

  useEffect(() => {
    fetchUrunler();
  }, []);

  const fetchUrunler = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/stok/urunler');
      setUrunler(response.data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
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
      await axios.post('http://localhost:3000/api/stok/urunler', formData);
      setFormData({ urun_adi: '', stok_miktari: '', birim: 'Adet', min_stok: '' });
      fetchUrunler();
      alert('Ürün başarıyla eklendi');
    } catch (error) {
      console.error('Ürün eklenemedi:', error);
      alert('Ürün eklenirken hata oluştu');
    }
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <h2>Stok Yönetimi</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Yeni Ürün Ekle</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Ürün Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    name="urun_adi"
                    value={formData.urun_adi}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stok Miktarı</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stok_miktari"
                    value={formData.stok_miktari}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Birim</label>
                  <select
                    className="form-control"
                    name="birim"
                    value={formData.birim}
                    onChange={handleInputChange}
                  >
                    <option>Adet</option>
                    <option>Kg</option>
                    <option>Litre</option>
                    <option>Metre</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Min. Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="min_stok"
                    value={formData.min_stok}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Ekle
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Ürün Listesi</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Yükleniyor...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Ürün Adı</th>
                        <th>Stok Miktarı</th>
                        <th>Birim</th>
                        <th>Min. Stok</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urunler.map(urun => (
                        <tr key={urun.id}>
                          <td>{urun.urun_adi}</td>
                          <td>{urun.stok_miktari}</td>
                          <td>{urun.birim}</td>
                          <td>{urun.min_stok}</td>
                          <td>
                            {urun.stok_miktari < urun.min_stok ? (
                              <span className="badge text-bg-danger">Kritik</span>
                            ) : (
                              <span className="badge text-bg-success">Normal</span>
                            )}
                          </td>
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

export default Stok;

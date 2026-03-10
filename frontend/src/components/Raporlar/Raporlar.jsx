import { useState } from 'react';
import axios from 'axios';

function Raporlar() {
  const [raporTipi, setRaporTipi] = useState('stok');
  const [raporData, setRaporData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRapor = async (tip) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/raporlar/${tip}`);
      setRaporData(response.data);
      setRaporTipi(tip);
    } catch (error) {
      console.error('Rapor yüklenemedi:', error);
      setRaporData([]);
    } finally {
      setLoading(false);
    }
  };

  const getRaporBasligi = () => {
    switch (raporTipi) {
      case 'stok':
        return 'Stok Durum Raporu';
      case 'finansal':
        return 'Finansal Rapor';
      case 'personel':
        return 'Personel Raporu';
      default:
        return 'Rapor';
    }
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-12">
          <h2>Raporlar</h2>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${raporTipi === 'stok' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => fetchRapor('stok')}
            >
              <i className="bi bi-box-seam me-2"></i>Stok Raporu
            </button>
            <button
              type="button"
              className={`btn ${raporTipi === 'finansal' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => fetchRapor('finansal')}
            >
              <i className="bi bi-graph-up me-2"></i>Finansal Rapor
            </button>
            <button
              type="button"
              className={`btn ${raporTipi === 'personel' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => fetchRapor('personel')}
            >
              <i className="bi bi-people me-2"></i>Personel Raporu
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">{getRaporBasligi()}</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          ) : raporData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    {Object.keys(raporData[0]).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {raporData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i}>
                          {typeof val === 'number' ? val.toFixed(2) : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              Rapor verisi bulunamadı. Lütfen bir rapor türü seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Raporlar;

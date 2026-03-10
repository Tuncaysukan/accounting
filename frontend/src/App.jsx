import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Stok from './components/Stok/Stok';
import Muhasebe from './components/Muhasebe/Muhasebe';
import Personel from './components/Personel/Personel';
import Raporlar from './components/Raporlar/Raporlar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        {/* Header */}
        <nav className="app-header navbar navbar-expand bg-body">
          <div className="container-fluid">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                  <i className="bi bi-list"></i>
                </a>
              </li>
              <li className="nav-item d-none d-md-block">
                <a href="/" className="nav-link">Anasayfa</a>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#" role="button">
                  <i className="bi bi-search"></i>
                </a>
              </li>
              <li className="nav-item dropdown user-menu">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <img src="/assets/img/user2-160x160.jpg" className="user-image rounded-circle shadow" alt="User" />
                  <span className="d-none d-md-inline">Kullanıcı</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                  <li className="user-header text-bg-primary">
                    <img src="/assets/img/user2-160x160.jpg" className="rounded-circle shadow" alt="User" />
                    <p>Sistem Kullanıcısı</p>
                  </li>
                  <li className="user-footer">
                    <a href="#" className="btn btn-default btn-flat">Profil</a>
                    <a href="#" className="btn btn-default btn-flat float-end">Çıkış</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>

        {/* Sidebar */}
        <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
          <div className="sidebar-brand">
            <a href="/" className="brand-link">
              <img src="/assets/img/AdminLTELogo.png" alt="Logo" className="brand-image opacity-75 shadow" />
              <span className="brand-text fw-light">Yönetim</span>
            </a>
          </div>
          <div className="sidebar-wrapper">
            <nav className="mt-2">
              <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="navigation" data-accordion="false">
                <li className="nav-item">
                  <Link to="/stok" className="nav-link">
                    <i className="nav-icon bi bi-box-seam"></i>
                    <p>Stok Yönetimi</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/muhasebe" className="nav-link">
                    <i className="nav-icon bi bi-receipt"></i>
                    <p>Muhasebe</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/personel" className="nav-link">
                    <i className="nav-icon bi bi-people"></i>
                    <p>Personel</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/raporlar" className="nav-link">
                    <i className="nav-icon bi bi-bar-chart"></i>
                    <p>Raporlar</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="app-main">
          <div className="app-content-header">
            <div className="container-fluid"></div>
          </div>
          <div className="app-content">
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/stok" element={<Stok />} />
                <Route path="/muhasebe" element={<Muhasebe />} />
                <Route path="/personel" element={<Personel />} />
                <Route path="/raporlar" element={<Raporlar />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Dashboard() {
  return (
    <div className="row">
      <div className="col-lg-3 col-6">
        <div className="small-box text-bg-primary">
          <div className="inner">
            <h3>150</h3>
            <p>Toplam Ürün</p>
          </div>
          <svg className="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="small-box text-bg-success">
          <div className="inner">
            <h3>53</h3>
            <p>Fatura</p>
          </div>
          <svg className="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="small-box text-bg-warning">
          <div className="inner">
            <h3>44</h3>
            <p>Personel</p>
          </div>
          <svg className="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>
      <div className="col-lg-3 col-6">
        <div className="small-box text-bg-danger">
          <div className="inner">
            <h3>65</h3>
            <p>Raporlar</p>
          </div>
          <svg className="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default App;

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { kullanici, cikisYap } = useAuth();
  const navigate = useNavigate();
  const rol = kullanici?.rol;

  const cikis = () => {
    cikisYap();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <button type="button" className="brand" onClick={() => navigate('/')}>
          <span className="brand-mark">F</span>
          <span className="brand-name">FiloRez</span>
        </button>

        <nav className="app-nav">
          {!kullanici && (
            <>
              <NavLink to="/" end className="nav-link">Ana Sayfa</NavLink>
              <NavLink to="/giris" className="nav-link nav-cta">Giriş Yap</NavLink>
            </>
          )}
          {rol === 'KULLANICI' && (
            <>
              <NavLink to="/araclar" className={({ isActive }) => `tab-link ${isActive ? 'tab-active' : ''}`}>Araçlar</NavLink>
              <NavLink to="/rezervasyonlarim" className={({ isActive }) => `tab-link ${isActive ? 'tab-active' : ''}`}>Rezervasyonlarım</NavLink>
            </>
          )}
          {rol === 'ADMIN' && (
            <>
              <NavLink to="/admin" end className={({ isActive }) => `tab-link ${isActive ? 'tab-active' : ''}`}>Genel Bakış</NavLink>
              <NavLink to="/admin/araclar" className={({ isActive }) => `tab-link ${isActive ? 'tab-active' : ''}`}>Araç Yönetimi</NavLink>
              <NavLink to="/admin/rezervasyonlar" className={({ isActive }) => `tab-link ${isActive ? 'tab-active' : ''}`}>Rezervasyonlar</NavLink>
            </>
          )}
          {kullanici && (
            <div className="user-chip">
              <div className="user-info">
                <div className="user-name">{kullanici.ad}</div>
                <div className="user-role">{rol === 'ADMIN' ? 'Filo Yöneticisi' : 'Personel'}</div>
              </div>
              <button type="button" className="icon-btn" title="Çıkış yap" aria-label="Çıkış yap" onClick={cikis}>
                ⏻
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

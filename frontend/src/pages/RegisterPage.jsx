import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usersApi } from '../api/users';
import { ApiError } from '../api/client';

const EPOSTA_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function RegisterPage() {
  const { girisYap } = useAuth();
  const { duyur } = useToast();
  const navigate = useNavigate();
  const [ad, setAd] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [rol, setRol] = useState('KULLANICI');
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const gonder = async (e) => {
    e.preventDefault();
    if (!ad.trim()) {
      duyur('Ad soyad gerekli.', 'hata');
      return;
    }
    if (!EPOSTA_REGEX.test(eposta.trim())) {
      duyur('Geçerli bir e-posta gir.', 'hata');
      return;
    }
    if (sifre.length < 6) {
      duyur('Şifre en az 6 karakter olmalı.', 'hata');
      return;
    }
    if (sifre !== sifreTekrar) {
      duyur('Şifreler eşleşmiyor.', 'hata');
      return;
    }
    setGonderiliyor(true);
    try {
      const kullanici = await usersApi.kayitOl(ad.trim(), eposta.trim(), sifre, rol);
      girisYap(kullanici);
      duyur('Hesabın oluşturuldu.', 'basari');
      navigate(kullanici.rol === 'ADMIN' ? '/admin' : '/araclar');
    } catch (err) {
      duyur(err instanceof ApiError ? err.message : 'Sunucuya ulaşılamadı.', 'hata');
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <div className="page page-narrow">
      <h1 className="page-title">Kayıt ol</h1>
      <p className="page-subtitle">Bilgilerini gir ve rolünü seç.</p>

      <form className="card login-card" onSubmit={gonder}>
        <label className="field-label">Ad Soyad</label>
        <input className="text-input" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Kullanici Adi" />

        <label className="field-label field-label-top">E-posta</label>
        <input
          className="text-input"
          type="email"
          autoComplete="email"
          value={eposta}
          onChange={(e) => setEposta(e.target.value)}
          placeholder="user@filorez.com"
        />

        <div className="form-grid-2">
          <div>
            <label className="field-label field-label-top">Şifre</label>
            <input
              className="text-input"
              type="password"
              autoComplete="new-password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="En az 6 karakter"
            />
          </div>
          <div>
            <label className="field-label field-label-top">Şifre tekrar</label>
            <input
              className="text-input"
              type="password"
              autoComplete="new-password"
              value={sifreTekrar}
              onChange={(e) => setSifreTekrar(e.target.value)}
              placeholder="••••••"
            />
          </div>
        </div>

        <label className="field-label field-label-top">Rol</label>
        <div className="role-grid">
          <button
            type="button"
            className={`role-btn ${rol === 'KULLANICI' ? 'role-btn-active' : ''}`}
            onClick={() => setRol('KULLANICI')}
          >
            <div className="role-title">Personel</div>
            <div className="role-sub">Araç ayır, takip et</div>
          </button>
          <button
            type="button"
            className={`role-btn ${rol === 'ADMIN' ? 'role-btn-active' : ''}`}
            onClick={() => setRol('ADMIN')}
          >
            <div className="role-title">Filo Yöneticisi</div>
            <div className="role-sub">Araç ve talep yönetimi</div>
          </button>
        </div>

        <button type="submit" className="btn btn-dark btn-block" disabled={gonderiliyor}>
          {gonderiliyor ? 'Oluşturuluyor…' : 'Hesap oluştur'}
        </button>

        <div className="auth-switch">
          Zaten hesabın var mı? <Link to="/giris">Giriş yap</Link>
        </div>
      </form>
    </div>
  );
}

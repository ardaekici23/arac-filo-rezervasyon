import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usersApi } from '../api/users';
import { ApiError } from '../api/client';

export default function LoginPage() {
  const { girisYap } = useAuth();
  const { duyur } = useToast();
  const navigate = useNavigate();
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const gonder = async (e) => {
    e.preventDefault();
    if (!eposta.trim() || !sifre) {
      duyur('E-posta ve şifre gerekli.', 'hata');
      return;
    }
    setGonderiliyor(true);
    try {
      const kullanici = await usersApi.girisYap(eposta.trim(), sifre);
      girisYap(kullanici);
      duyur(`Hoş geldin, ${kullanici.ad}.`, 'basari');
      navigate(kullanici.rol === 'ADMIN' ? '/admin' : '/araclar');
    } catch (err) {
      duyur(err instanceof ApiError ? err.message : 'Sunucuya ulaşılamadı.', 'hata');
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <div className="page page-narrow">
      <h1 className="page-title">Giriş yap</h1>
      <p className="page-subtitle">Hesabınla giriş yap, panelin rolüne göre açılır.</p>

      <form className="card login-card" onSubmit={gonder}>
        <label className="field-label">E-posta</label>
        <input
          className="text-input"
          type="email"
          autoComplete="email"
          value={eposta}
          onChange={(e) => setEposta(e.target.value)}
          placeholder="user@filorez.com"
        />

        <label className="field-label field-label-top">Şifre</label>
        <input
          className="text-input"
          type="password"
          autoComplete="current-password"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          placeholder="••••••"
        />

        <button type="submit" className="btn btn-dark btn-block" disabled={gonderiliyor}>
          {gonderiliyor ? 'Giriş yapılıyor…' : 'Giriş yap'}
        </button>

        <div className="auth-switch">
          Hesabın yok mu? <Link to="/kayit">Kayıt ol</Link>
        </div>
      </form>

      <div className="demo-hint">
        Demo hesaplar — personel: user@filorez.com · yönetici: admin@filorez.com · şifre: 123456
      </div>
    </div>
  );
}

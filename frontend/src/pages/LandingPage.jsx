import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFleetData } from '../context/FleetDataContext';
import MonthCalendar from '../components/MonthCalendar';
import { doluGunler } from '../domain/occupancy';
import { bugunIso } from '../domain/dates';

const ADIMLAR = [
  { no: '1', baslik: 'Aracı seç', metin: 'Filodaki araçları plaka veya türe göre süz.' },
  { no: '2', baslik: 'Boş günleri işaretle', metin: 'Takvimde dolu günler kapalı gelir; sadece müsait aralığı seçebilirsin.' },
  { no: '3', baslik: 'Rezervasyonu oluştur', metin: 'Talebin hemen kaydedilir, durumunu rezervasyonlarımdan takip edersin.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { araclar, rezervasyonlar } = useFleetData();
  const today = new Date();

  const istatistik = useMemo(() => {
    const bugun = bugunIso();
    const aktif = rezervasyonlar.filter(
      (r) => (r.durum === 'BEKLEMEDE' || r.durum === 'ONAYLANDI') && r.bitisTarihi >= bugun
    ).length;
    const ayGun = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const oranlar = araclar.map((v) => {
      let n = 0;
      doluGunler(rezervasyonlar, v.id).forEach((k) => {
        const d = new Date(k);
        if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()) n++;
      });
      return Math.round((n / ayGun) * 100);
    });
    const doluluk = oranlar.length ? Math.round(oranlar.reduce((t, o) => t + o, 0) / oranlar.length) : 0;
    return { aracSayisi: araclar.length, aktifRezervasyon: aktif, doluluk };
  }, [araclar, rezervasyonlar]);

  const onizlemeArac = araclar[0];

  return (
    <div>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <div>
            <div className="eyebrow">Kurumsal filo rezervasyon</div>
            <h1 className="hero-title">Şirket aracını<br />dakikalar içinde ayır.</h1>
            <p className="hero-text">
              Filodaki tüm araçların doluluk takvimi tek ekranda. Boş günleri seç, çakışma olmadan
              rezervasyonunu oluştur, geçmiş taleplerini takip et.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-light" onClick={() => navigate('/giris')}>
                Giriş yap →
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/giris')}>
                Nasıl çalışır?
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-value">{istatistik.aracSayisi}</div>
                <div className="stat-label">kayıtlı araç</div>
              </div>
              <div>
                <div className="stat-value">{istatistik.aktifRezervasyon}</div>
                <div className="stat-label">aktif rezervasyon</div>
              </div>
              <div>
                <div className="stat-value">%{istatistik.doluluk}</div>
                <div className="stat-label">bu ay doluluk</div>
              </div>
            </div>
          </div>

          {onizlemeArac && (
            <div className="hero-card">
              <div className="hero-card-head">
                <div className="hero-card-title">{today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</div>
                <div className="hero-card-sub">{onizlemeArac.plaka} · {onizlemeArac.markaModel}</div>
              </div>
              <MonthCalendar
                yil={today.getFullYear()}
                ay={today.getMonth()}
                doluSet={doluGunler(rezervasyonlar, onizlemeArac.id)}
              />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Nasıl çalışır?</h2>
        <div className="steps-grid">
          {ADIMLAR.map((a) => (
            <div key={a.no} className="card step-card">
              <div className="step-no">{a.no}</div>
              <h3 className="step-title">{a.baslik}</h3>
              <p className="step-text">{a.metin}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card cta-card">
          <div>
            <h2 className="cta-title">Filoyu yönetenler için de hazır.</h2>
            <p className="cta-text">Araç ekle, bakıma al, tüm rezervasyon taleplerini takip et. Doluluk raporları genel bakış ekranında.</p>
          </div>
          <button type="button" className="btn btn-dark" onClick={() => navigate('/giris')}>
            Panele git →
          </button>
        </div>
      </section>
    </div>
  );
}

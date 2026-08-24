import { useMemo, useState } from 'react';
import { useFleetData } from '../context/FleetDataContext';
import ReservationModal from '../components/ReservationModal';
import { VEHICLE_STATUS_CLASS, VEHICLE_STATUS_LABEL, VEHICLE_TYPE_LABEL } from '../domain/constants';
import { bugunIso } from '../domain/dates';

export default function VehiclesPage() {
  const { araclar, rezervasyonlar, yukleniyor, hata } = useFleetData();
  const [filtre, setFiltre] = useState('');
  const [turFiltre, setTurFiltre] = useState('TUMU');
  const [seciliArac, setSeciliArac] = useState(null);

  const filtreliAraclar = useMemo(() => {
    const q = filtre.trim().toLowerCase();
    return araclar.filter((v) => {
      const turEsle = turFiltre === 'TUMU' || v.tur === turFiltre;
      const qEsle = !q || `${v.plaka} ${v.markaModel}`.toLowerCase().includes(q);
      return turEsle && qEsle;
    });
  }, [araclar, filtre, turFiltre]);

  const bugun = bugunIso();
  const yaklasanSayisi = (aracId) =>
    rezervasyonlar.filter((r) => r.aracId === aracId && r.durum !== 'IPTAL' && r.bitisTarihi >= bugun).length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Araçlar</h1>
          <p className="page-subtitle">Bir araca tıkla, takvimden boş günleri seç.</p>
        </div>
        <div className="filters-row">
          <input
            className="text-input"
            style={{ width: 240 }}
            value={filtre}
            onChange={(e) => setFiltre(e.target.value)}
            placeholder="Plaka veya model ara"
          />
          <select className="select-input" value={turFiltre} onChange={(e) => setTurFiltre(e.target.value)}>
            <option value="TUMU">Tüm türler</option>
            <option value="BINEK">Binek</option>
            <option value="TICARI">Ticari</option>
          </select>
        </div>
      </div>

      {hata && <div className="banner banner-error">API'ye ulaşılamadı: {hata}</div>}
      {yukleniyor && <div className="empty-note">Yükleniyor…</div>}

      <div className="vehicle-grid">
        {filtreliAraclar.map((v) => (
          <button type="button" key={v.id} className="vehicle-card" onClick={() => setSeciliArac(v)}>
            <div className="vehicle-card-top">
              {v.fotoUrl ? (
                <>
                  <img className="vehicle-photo" src={v.fotoUrl} alt={v.markaModel} />
                  <div className="vehicle-photo-overlay" />
                </>
              ) : (
                <div className="vehicle-photo-placeholder">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2v-4l-2-5H5L3 13v4h2"></path>
                    <circle cx="7" cy="17" r="2"></circle>
                    <circle cx="17" cy="17" r="2"></circle>
                    <path d="M9 17h6"></path>
                  </svg>
                </div>
              )}
              <span className="plate-badge vehicle-card-plate">{v.plaka}</span>
              <span className={`${VEHICLE_STATUS_CLASS[v.durum]} vehicle-card-status`}>{VEHICLE_STATUS_LABEL[v.durum] || v.durum}</span>
            </div>
            <div className="vehicle-card-body">
              <div className="vehicle-title">{v.markaModel}</div>
              <div className="vehicle-sub">{VEHICLE_TYPE_LABEL[v.tur] || v.tur}</div>
              <div className="vehicle-card-foot">
                <span className="muted-note">
                  {yaklasanSayisi(v.id) === 0 ? 'Yaklaşan rezervasyon yok' : `${yaklasanSayisi(v.id)} yaklaşan rezervasyon`}
                </span>
                <span className="link-strong">Takvimi aç →</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!yukleniyor && filtreliAraclar.length === 0 && (
        <div className="empty-note empty-note-center">Aramanla eşleşen araç yok.</div>
      )}

      {seciliArac && <ReservationModal arac={seciliArac} onClose={() => setSeciliArac(null)} />}
    </div>
  );
}

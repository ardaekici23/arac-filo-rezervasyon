import {
  RESERVATION_STATUS_CLASS,
  RESERVATION_STATUS_LABEL,
  VEHICLE_CATEGORY_LABEL,
  VEHICLE_STATUS_LABEL,
  FUEL_TYPE_LABEL,
  GEARBOX_LABEL,
} from '../domain/constants';
import { gunFarki, trTarih } from '../domain/dates';

function tuketimOzet(v) {
  if (v.yakit === 'ELEKTRIK') {
    return `${v.menzil ?? '—'} km menzil · ${v.kwh ?? '—'} kWh/100km`;
  }
  if (!v.yakit) return '—';
  return `Şehir ${v.sehirTuketim ?? '—'} · Yol ${v.yolTuketim ?? '—'} L/100km`;
}

export default function ReservationDetailModal({ rezervasyon, arac, onaylanabilir, iptalEdilebilir, onOnayla, onIptal, onClose }) {
  const talepAlanlari = [
    { etiket: 'Personel', deger: rezervasyon.kullaniciAdi },
    { etiket: 'Talep tarihi', deger: trTarih(rezervasyon.olusturmaTarihi?.slice(0, 10)) },
    { etiket: 'Başlangıç', deger: trTarih(rezervasyon.baslangicTarihi) },
    { etiket: 'Bitiş', deger: trTarih(rezervasyon.bitisTarihi) },
  ];

  const aracAlanlari = arac ? [
    { etiket: 'Kategori', deger: VEHICLE_CATEGORY_LABEL[arac.kategori] || arac.kategori || '—' },
    { etiket: 'Model yılı', deger: arac.yil || '—' },
    { etiket: 'Vites', deger: GEARBOX_LABEL[arac.vites] || arac.vites || 'Otomatik' },
    { etiket: 'Yakıt', deger: FUEL_TYPE_LABEL[arac.yakit] || arac.yakit || '—' },
    { etiket: 'Koltuk', deger: `${arac.koltuk || 5} kişi` },
    { etiket: 'Kilometre', deger: `${(arac.km || 0).toLocaleString('tr-TR')} km` },
    { etiket: arac.yakit === 'ELEKTRIK' ? 'Menzil / tüketim' : 'Ortalama tüketim', deger: tuketimOzet(arac) },
    { etiket: 'Araç durumu', deger: VEHICLE_STATUS_LABEL[arac.durum] || arac.durum || '—' },
  ] : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">Rezervasyon #{rezervasyon.id}</div>
            <div className="modal-title modal-title-lg">{trTarih(rezervasyon.baslangicTarihi)} → {trTarih(rezervasyon.bitisTarihi)}</div>
            <div className="modal-head-row detail-status-row">
              <span className={RESERVATION_STATUS_CLASS[rezervasyon.durum]}>{RESERVATION_STATUS_LABEL[rezervasyon.durum]}</span>
              <span className="muted-note">{gunFarki(rezervasyon.baslangicTarihi, rezervasyon.bitisTarihi)} gün</span>
            </div>
          </div>
          <button type="button" className="icon-btn" aria-label="Kapat" onClick={onClose}>✕</button>
        </div>

        <div className="detail-grid">
          {talepAlanlari.map((a) => (
            <div key={a.etiket} className="detail-field">
              <span className="detail-label">{a.etiket}</span>
              <span className="detail-value">{a.deger}</span>
            </div>
          ))}
        </div>

        {rezervasyon.amac && (
          <div className="detail-note-box">
            <div className="detail-label">Not</div>
            <div className="detail-note-text">{rezervasyon.amac}</div>
          </div>
        )}

        <div className="detail-vehicle-block">
          <div className="detail-label">Araç bilgileri</div>
          <div className="detail-vehicle-head">
            <div className="detail-vehicle-thumb">
              {arac?.fotoUrl ? (
                <img src={arac.fotoUrl} alt={arac.markaModel} />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2v-4l-2-5H5L3 13v4h2"></path>
                  <circle cx="7" cy="17" r="2"></circle>
                  <circle cx="17" cy="17" r="2"></circle>
                  <path d="M9 17h6"></path>
                </svg>
              )}
            </div>
            <div className="detail-vehicle-info">
              <span className="detail-vehicle-name">{arac ? arac.markaModel : 'Silinmiş araç'}</span>
              {arac && <span className="plate-badge">{arac.plaka}</span>}
            </div>
          </div>

          {arac && (
            <div className="detail-grid detail-grid-3">
              {aracAlanlari.map((a) => (
                <div key={a.etiket} className="detail-field">
                  <span className="detail-label">{a.etiket}</span>
                  <span className="detail-value">{a.deger}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Kapat</button>
          {onaylanabilir && <button type="button" className="btn btn-success" onClick={onOnayla}>Onayla</button>}
          {iptalEdilebilir && <button type="button" className="btn btn-outline-danger" onClick={onIptal}>İptal et</button>}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useFleetData } from '../context/FleetDataContext';
import ReservationModal from '../components/ReservationModal';
import ReservationSuccessModal from '../components/ReservationSuccessModal';
import {
  VEHICLE_STATUS_CLASS,
  VEHICLE_STATUS_LABEL,
  VEHICLE_TYPE_LABEL,
  VEHICLE_CATEGORY_LABEL,
  VEHICLE_CATEGORY_OPTIONS,
  FUEL_TYPE_OPTIONS,
  GEARBOX_OPTIONS,
} from '../domain/constants';
import { bugunIso, iso, gunEkle, haftaBaslangici } from '../domain/dates';
import { doluGunler, aralikTemizMi } from '../domain/occupancy';

const BOS_FILTRE = {
  arama: '',
  durum: 'HEPSI',
  tarihBas: '',
  tarihBit: '',
  kategoriler: [],
  vitesler: [],
  yakitlar: [],
  kmBucket: 'HEPSI',
  minKoltuk: 'HEPSI',
  yaklasanYok: false,
  siralama: 'MUSAIT_ONCE',
};

const KOLTUK_SECENEKLERI = ['HEPSI', 5, 7, 9];
const KM_SECENEKLERI = [
  { anahtar: 'HEPSI', etiket: 'Hepsi' },
  { anahtar: '0-50', etiket: '0–50 bin' },
  { anahtar: '50-100', etiket: '50–100 bin' },
  { anahtar: '100+', etiket: '100 bin+' },
];
const SIRALAMA_SECENEKLERI = [
  { anahtar: 'MUSAIT_ONCE', etiket: 'Önce müsait olanlar' },
  { anahtar: 'KOLTUK_ARTAN', etiket: 'Koltuk (artan)' },
  { anahtar: 'KOLTUK_AZALAN', etiket: 'Koltuk (azalan)' },
  { anahtar: 'YIL_YENI', etiket: 'Model yılı (yeni → eski)' },
  { anahtar: 'AD_AZ', etiket: 'Ada göre (A → Z)' },
];

function tuketimOzet(v) {
  if (v.yakit === 'ELEKTRIK') {
    return `${v.menzil ?? '—'} km menzil · ${v.kwh ?? '—'} kWh/100km`;
  }
  if (!v.yakit) return null;
  return `Şehir ${v.sehirTuketim ?? '—'} · Yol ${v.yolTuketim ?? '—'} L/100km`;
}

export default function VehiclesPage() {
  const { araclar, rezervasyonlar, yukleniyor, hata } = useFleetData();
  const [filtre, setFiltre] = useState(BOS_FILTRE);
  const [seciliArac, setSeciliArac] = useState(null);
  const [basariEkrani, setBasariEkrani] = useState(null);

  const alan = (k) => (e) => setFiltre((f) => ({ ...f, [k]: e.target.value }));
  const coguldegistir = (alanAdi, deger) =>
    setFiltre((f) => ({
      ...f,
      [alanAdi]: f[alanAdi].includes(deger) ? f[alanAdi].filter((x) => x !== deger) : [...f[alanAdi], deger],
    }));

  const bugun = bugunIso();
  const yaklasanSayisi = (aracId) =>
    rezervasyonlar.filter((r) => r.aracId === aracId && r.durum !== 'IPTAL' && r.bitisTarihi >= bugun).length;

  const bugunAralik = () => setFiltre((f) => ({ ...f, tarihBas: bugun, tarihBit: bugun }));
  const buHaftaAralik = () => {
    const bas = haftaBaslangici(new Date());
    setFiltre((f) => ({ ...f, tarihBas: iso(bas), tarihBit: iso(gunEkle(bas, 6)) }));
  };
  const gelecekHaftaAralik = () => {
    const bas = gunEkle(haftaBaslangici(new Date()), 7);
    setFiltre((f) => ({ ...f, tarihBas: iso(bas), tarihBit: iso(gunEkle(bas, 6)) }));
  };

  const filtreliAraclar = useMemo(() => {
    const q = filtre.arama.trim().toLowerCase();
    let sonuc = araclar.filter((v) => {
      if (q && !`${v.plaka} ${v.markaModel}`.toLowerCase().includes(q)) return false;
      if (filtre.durum === 'MUSAIT' && v.durum !== 'MUSAIT') return false;
      if (filtre.durum === 'BAKIMDA' && v.durum === 'MUSAIT') return false;
      if (filtre.kategoriler.length > 0 && !filtre.kategoriler.includes(v.kategori)) return false;
      if (filtre.vitesler.length > 0 && !filtre.vitesler.includes(v.vites)) return false;
      if (filtre.yakitlar.length > 0 && !filtre.yakitlar.includes(v.yakit)) return false;
      if (filtre.kmBucket === '0-50' && !(v.km != null && v.km < 50000)) return false;
      if (filtre.kmBucket === '50-100' && !(v.km != null && v.km >= 50000 && v.km < 100000)) return false;
      if (filtre.kmBucket === '100+' && !(v.km != null && v.km >= 100000)) return false;
      if (filtre.minKoltuk !== 'HEPSI' && !(v.koltuk != null && v.koltuk >= filtre.minKoltuk)) return false;
      if (filtre.yaklasanYok && yaklasanSayisi(v.id) !== 0) return false;
      if (filtre.tarihBas && filtre.tarihBit) {
        if (v.durum !== 'MUSAIT') return false;
        if (!aralikTemizMi(filtre.tarihBas, filtre.tarihBit, doluGunler(rezervasyonlar, v.id))) return false;
      }
      return true;
    });

    sonuc = [...sonuc].sort((a, b) => {
      switch (filtre.siralama) {
        case 'KOLTUK_ARTAN':
          return (a.koltuk ?? 0) - (b.koltuk ?? 0);
        case 'KOLTUK_AZALAN':
          return (b.koltuk ?? 0) - (a.koltuk ?? 0);
        case 'YIL_YENI':
          return (b.yil ?? 0) - (a.yil ?? 0);
        case 'AD_AZ':
          return a.markaModel.localeCompare(b.markaModel, 'tr');
        case 'MUSAIT_ONCE':
        default: {
          const fark = (a.durum === 'MUSAIT' ? 0 : 1) - (b.durum === 'MUSAIT' ? 0 : 1);
          return fark !== 0 ? fark : a.markaModel.localeCompare(b.markaModel, 'tr');
        }
      }
    });

    return sonuc;
  }, [araclar, rezervasyonlar, filtre]);

  return (
    <div className="page page-full">
      <div className="page-head">
        <div>
          <h1 className="page-title">Araçlar</h1>
          <p className="page-subtitle">Bir araca tıkla, takvimden boş günleri seç.</p>
        </div>
        <span className="muted-note">{filtreliAraclar.length} araç bulundu</span>
      </div>

      {hata && <div className="banner banner-error">API'ye ulaşılamadı: {hata}</div>}
      {yukleniyor && <div className="empty-note">Yükleniyor…</div>}

      <div className="vehicles-layout">
        <aside className="filter-sidebar">
          <div className="filter-sidebar-head">
            <span className="filter-sidebar-title">Filtreler</span>
            <button type="button" className="filter-clear-btn" onClick={() => setFiltre(BOS_FILTRE)}>Temizle</button>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Ara</label>
            <input className="text-input" value={filtre.arama} onChange={alan('arama')} placeholder="Plaka, marka veya model" />
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Araç durumu</label>
            <div className="filter-chip-grid">
              {[
                { anahtar: 'HEPSI', etiket: 'Hepsi' },
                { anahtar: 'MUSAIT', etiket: 'Müsait' },
                { anahtar: 'BAKIMDA', etiket: 'Bakımda' },
              ].map((d) => (
                <button
                  key={d.anahtar}
                  type="button"
                  className={`chip-toggle ${filtre.durum === d.anahtar ? 'chip-toggle-active' : ''}`}
                  onClick={() => setFiltre((f) => ({ ...f, durum: d.anahtar }))}
                >
                  {d.etiket}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Belirli tarihlerde boş</label>
            <div className="filter-daterange">
              <input type="date" className="text-input" value={filtre.tarihBas} onChange={alan('tarihBas')} />
              <span className="muted-note">–</span>
              <input type="date" className="text-input" value={filtre.tarihBit} onChange={alan('tarihBit')} />
            </div>
            <div className="filter-quickrange">
              <button type="button" className="chip-toggle" onClick={bugunAralik}>Bugün</button>
              <button type="button" className="chip-toggle" onClick={buHaftaAralik}>Bu hafta</button>
              <button type="button" className="chip-toggle" onClick={gelecekHaftaAralik}>Gelecek hafta</button>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Kategori</label>
            <div className="filter-chip-grid">
              {VEHICLE_CATEGORY_OPTIONS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`chip-toggle ${filtre.kategoriler.includes(k) ? 'chip-toggle-active' : ''}`}
                  onClick={() => coguldegistir('kategoriler', k)}
                >
                  {VEHICLE_CATEGORY_LABEL[k]}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Vites</label>
            <div className="filter-chip-grid">
              {GEARBOX_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`chip-toggle ${filtre.vitesler.includes(v) ? 'chip-toggle-active' : ''}`}
                  onClick={() => coguldegistir('vitesler', v)}
                >
                  {v === 'OTOMATIK' ? 'Otomatik' : 'Manuel'}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Kilometre</label>
            <div className="filter-chip-grid">
              {KM_SECENEKLERI.map((k) => (
                <button
                  key={k.anahtar}
                  type="button"
                  className={`chip-toggle ${filtre.kmBucket === k.anahtar ? 'chip-toggle-active' : ''}`}
                  onClick={() => setFiltre((f) => ({ ...f, kmBucket: k.anahtar }))}
                >
                  {k.etiket}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">En az koltuk</label>
            <div className="filter-chip-grid">
              {KOLTUK_SECENEKLERI.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`chip-toggle ${filtre.minKoltuk === k ? 'chip-toggle-active' : ''}`}
                  onClick={() => setFiltre((f) => ({ ...f, minKoltuk: k }))}
                >
                  {k === 'HEPSI' ? 'Hepsi' : `${k}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Yakıt tipi</label>
            <div className="filter-chip-grid">
              {FUEL_TYPE_OPTIONS.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`chip-toggle ${filtre.yakitlar.includes(y) ? 'chip-toggle-active' : ''}`}
                  onClick={() => coguldegistir('yakitlar', y)}
                >
                  {y.charAt(0) + y.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section filter-toggle-row">
            <label>
              <input
                type="checkbox"
                checked={filtre.yaklasanYok}
                onChange={(e) => setFiltre((f) => ({ ...f, yaklasanYok: e.target.checked }))}
              />
              Yaklaşan rezervasyonu olmayanlar
            </label>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Sırala</label>
            <select className="select-input select-block sort-select" value={filtre.siralama} onChange={alan('siralama')}>
              {SIRALAMA_SECENEKLERI.map((s) => (
                <option key={s.anahtar} value={s.anahtar}>{s.etiket}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className="vehicles-content">
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
                  <div className="vehicle-meta-row">
                    {tuketimOzet(v) && <span className="muted-note">{tuketimOzet(v)}</span>}
                    <span className="muted-note">{v.km != null ? `${v.km.toLocaleString('tr-TR')} km` : '—'}</span>
                  </div>
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
            <div className="empty-note empty-note-center">
              Bu filtrelerle eşleşen araç yok.
              <div style={{ marginTop: 14 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setFiltre(BOS_FILTRE)}>Filtreleri temizle</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {seciliArac && (
        <ReservationModal
          arac={seciliArac}
          onClose={() => setSeciliArac(null)}
          onCreated={(bilgi) => { setSeciliArac(null); setBasariEkrani(bilgi); }}
        />
      )}
      {basariEkrani && (
        <ReservationSuccessModal {...basariEkrani} onClose={() => setBasariEkrani(null)} />
      )}
    </div>
  );
}

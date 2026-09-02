import { useState } from 'react';
import { useFleetData } from '../context/FleetDataContext';
import { useToast } from '../context/ToastContext';
import { vehiclesApi } from '../api/vehicles';
import { ApiError } from '../api/client';
import VehicleFormModal from '../components/VehicleFormModal';
import {
  VEHICLE_STATUS_CLASS,
  VEHICLE_STATUS_LABEL,
  VEHICLE_TYPE_LABEL,
  VEHICLE_CATEGORY_LABEL,
  FUEL_TYPE_LABEL,
} from '../domain/constants';

export default function AdminVehiclesPage() {
  const { araclar, veriYukle } = useFleetData();
  const { duyur } = useToast();
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState(null);

  const yeniArac = () => { setDuzenlenen(null); setFormAcik(true); };
  const duzenle = (v) => { setDuzenlenen(v); setFormAcik(true); };
  const kapat = () => setFormAcik(false);

  const sil = async (v) => {
    if (!window.confirm(`${v.plaka} plakalı aracı silmek istediğine emin misin?`)) return;
    try {
      await vehiclesApi.remove(v.id);
      duyur('Araç silindi.', 'uyari');
      await veriYukle();
    } catch (e) {
      duyur(e instanceof ApiError ? e.message : 'Sunucuya ulaşılamadı.', 'hata');
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Araç Yönetimi</h1>
          <p className="page-subtitle">{araclar.length} araç kayıtlı</p>
        </div>
        <button type="button" className="btn btn-dark" onClick={yeniArac}>+ Araç ekle</button>
      </div>

      <div className="card table-card">
        <div className="table-row table-head admin-vehicle-cols">
          <div>Plaka</div><div>Araç</div><div>Tür</div><div>Km</div><div>Durum</div><div className="align-right">İşlem</div>
        </div>
        {araclar.map((v) => (
          <div key={v.id} className="table-row admin-vehicle-cols">
            <div className="row-plate">{v.plaka}</div>
            <div className="admin-vehicle-cell">
              <span className="admin-thumb">
                {v.fotoUrl ? (
                  <img src={v.fotoUrl} alt="" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <circle cx="9" cy="10" r="1.6"></circle>
                    <path d="M21 16l-5-5-6 6"></path>
                  </svg>
                )}
              </span>
              <div>
                <div>{v.markaModel}</div>
                <div className="row-sub">
                  {[VEHICLE_CATEGORY_LABEL[v.kategori], FUEL_TYPE_LABEL[v.yakit], v.koltuk ? `${v.koltuk} koltuk` : null]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </div>
              </div>
            </div>
            <div className="muted-note">{VEHICLE_TYPE_LABEL[v.tur] || v.tur}</div>
            <div className="muted-note">{v.km != null ? `${v.km.toLocaleString('tr-TR')} km` : '—'}</div>
            <div><span className={VEHICLE_STATUS_CLASS[v.durum]}>{VEHICLE_STATUS_LABEL[v.durum] || v.durum}</span></div>
            <div className="row-actions align-right">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => duzenle(v)}>Düzenle</button>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => sil(v)}>Sil</button>
            </div>
          </div>
        ))}
        {araclar.length === 0 && <div className="empty-note empty-note-center">Henüz araç eklenmedi.</div>}
      </div>

      {formAcik && <VehicleFormModal arac={duzenlenen} onClose={kapat} />}
    </div>
  );
}

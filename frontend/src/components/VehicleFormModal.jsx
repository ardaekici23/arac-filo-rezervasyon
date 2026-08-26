import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useFleetData } from '../context/FleetDataContext';
import { vehiclesApi } from '../api/vehicles';
import { ApiError } from '../api/client';

const BOS_FORM = { plaka: '', markaModel: '', tur: 'BINEK', durum: 'AKTIF', fotoUrl: '' };
const MAX_FOTO_BYTE = 4 * 1024 * 1024;

export default function VehicleFormModal({ arac, onClose }) {
  const { duyur } = useToast();
  const { veriYukle } = useFleetData();
  const [form, setForm] = useState(arac ? { ...BOS_FORM, ...arac } : { ...BOS_FORM });
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const alan = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const fotoDosyaSec = (e) => {
    const dosya = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!dosya) return;
    if (dosya.size > MAX_FOTO_BYTE) {
      duyur('Fotoğraf 4 MB’dan küçük olmalı.', 'hata');
      return;
    }
    const okuyucu = new FileReader();
    okuyucu.onload = () => setForm((f) => ({ ...f, fotoUrl: okuyucu.result }));
    okuyucu.readAsDataURL(dosya);
  };

  const fotoKaldir = () => setForm((f) => ({ ...f, fotoUrl: '' }));

  const kaydet = async () => {
    if (!form.plaka.trim() || !form.markaModel.trim()) {
      duyur('Plaka ve marka/model zorunlu.', 'hata');
      return;
    }
    setKaydediliyor(true);
    const govde = {
      plaka: form.plaka.trim(),
      markaModel: form.markaModel.trim(),
      tur: form.tur,
      durum: form.durum,
      fotoUrl: form.fotoUrl || '',
    };
    try {
      if (arac) await vehiclesApi.update(arac.id, govde);
      else await vehiclesApi.create(govde);
      duyur(arac ? 'Araç güncellendi.' : 'Araç eklendi.', 'basari');
      await veriYukle();
      onClose();
    } catch (e) {
      duyur(e instanceof ApiError ? e.message : 'Sunucuya ulaşılamadı.', 'hata');
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-narrow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{arac ? 'Aracı düzenle' : 'Yeni araç'}</div>

        <label className="field-label field-label-top">Plaka</label>
        <input className="text-input" value={form.plaka} onChange={alan('plaka')} placeholder="34 ABC 123" />

        <label className="field-label field-label-top">Marka / Model</label>
        <input className="text-input" value={form.markaModel} onChange={alan('markaModel')} placeholder="Volkswagen Passat" />

        <div className="form-grid-2">
          <div>
            <label className="field-label field-label-top">Tür</label>
            <select className="select-input select-block" value={form.tur} onChange={alan('tur')}>
              <option value="BINEK">Binek</option>
              <option value="TICARI">Ticari</option>
            </select>
          </div>
          <div>
            <label className="field-label field-label-top">Durum</label>
            <select className="select-input select-block" value={form.durum} onChange={alan('durum')}>
              <option value="AKTIF">Aktif</option>
              <option value="BAKIMDA">Bakımda</option>
            </select>
          </div>
        </div>

        <div className="photo-field">
          <div className="field-label">Araç fotoğrafı</div>
          <div className="photo-field-row">
            <div className="photo-preview">
              {form.fotoUrl ? (
                <img src={form.fotoUrl} alt="Önizleme" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <circle cx="9" cy="10" r="1.6"></circle>
                  <path d="M21 16l-5-5-6 6"></path>
                </svg>
              )}
            </div>
            <div className="photo-field-controls">
              <input
                className="text-input"
                value={form.fotoUrl}
                onChange={alan('fotoUrl')}
                placeholder="Fotoğraf bağlantısı (https://…)"
              />
              <div className="photo-field-buttons">
                <label className="btn btn-outline btn-sm file-upload-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <path d="M17 8l-5-5-5 5"></path>
                    <path d="M12 3v12"></path>
                  </svg>
                  Dosya yükle
                  <input type="file" accept="image/*" onChange={fotoDosyaSec} hidden />
                </label>
                {form.fotoUrl && (
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={fotoKaldir}>Kaldır</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Vazgeç</button>
          <button type="button" className="btn btn-dark" disabled={kaydediliyor} onClick={kaydet}>
            {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

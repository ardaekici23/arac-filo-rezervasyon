import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useFleetData } from '../context/FleetDataContext';
import { vehiclesApi } from '../api/vehicles';
import { ApiError } from '../api/client';
import { MARKALAR, YILLAR, markaModelAyristir, modelSecenekleriGetir } from '../domain/vehicleCatalog';
import {
  VEHICLE_STATUS_LABEL,
  VEHICLE_CATEGORY_LABEL,
  FUEL_TYPE_LABEL,
  GEARBOX_LABEL,
} from '../domain/constants';

const BOS_FORM = {
  plaka: '', marka: '', model: '', yil: '', tur: 'BINEK', durum: 'MUSAIT', fotoUrl: '',
  kategori: 'SEDAN', koltuk: 5, yakit: 'BENZIN', vites: 'MANUEL', km: '',
  sehirTuketim: '', yolTuketim: '', menzil: '', kwh: '',
};
const MAX_FOTO_BYTE = 4 * 1024 * 1024;
const PLAKA_DESENI =
  /^(0[1-9]|[1-7][0-9]|8[01])([ABCDEFGHIJKLMNOPRSTUVYZ]\d{4}|[ABCDEFGHIJKLMNOPRSTUVYZ]{2}\d{3,4}|[ABCDEFGHIJKLMNOPRSTUVYZ]{3}\d{2,3})$/;

function plakaGecerliMi(plaka) {
  const temiz = plaka
    .replace(/[ıİi]/g, 'I')
    .toUpperCase()
    .replace(/[\s-]+/g, '');
  const eslesme = temiz.match(PLAKA_DESENI);
  if (!eslesme) return { gecerli: false, mesaj: 'Geçersiz plaka formatı.' };
  const harfGrubu = eslesme[2].match(/^[A-Z]+/)[0];
  if (harfGrubu.startsWith('T')) {
    return { gecerli: false, mesaj: 'Taksi plakaları (T ile başlayan) şirket aracı olarak kaydedilemez.' };
  }
  return { gecerli: true };
}

function formaCevir(arac) {
  if (!arac) return { ...BOS_FORM };
  const { marka, model } = markaModelAyristir(arac.markaModel);
  return {
    ...BOS_FORM,
    ...arac,
    marka,
    model,
    kategori: arac.kategori || BOS_FORM.kategori,
    koltuk: arac.koltuk ?? BOS_FORM.koltuk,
    yakit: arac.yakit || BOS_FORM.yakit,
    vites: arac.vites || BOS_FORM.vites,
    km: arac.km ?? '',
    sehirTuketim: arac.sehirTuketim ?? '',
    yolTuketim: arac.yolTuketim ?? '',
    menzil: arac.menzil ?? '',
    kwh: arac.kwh ?? '',
  };
}

export default function VehicleFormModal({ arac, onClose }) {
  const { duyur } = useToast();
  const { veriYukle } = useFleetData();
  const [form, setForm] = useState(() => formaCevir(arac));
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const alan = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const markaAlan = (e) => setForm((f) => ({ ...f, marka: e.target.value, model: '' }));

  const yakitAlan = (e) => {
    const yeni = e.target.value;
    setForm((f) => ({
      ...f,
      yakit: yeni,
      ...(yeni === 'ELEKTRIK'
        ? { sehirTuketim: '', yolTuketim: '' }
        : { menzil: '', kwh: '' }),
    }));
  };

  const modelSecenekleri = modelSecenekleriGetir(form.marka, form.model);

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
    if (!form.plaka.trim() || !form.marka || !form.model) {
      duyur('Plaka, marka ve model zorunlu.', 'hata');
      return;
    }
    const plakaKontrol = plakaGecerliMi(form.plaka);
    if (!plakaKontrol.gecerli) {
      duyur(plakaKontrol.mesaj, 'hata');
      return;
    }
    setKaydediliyor(true);
    const govde = {
      plaka: form.plaka.trim(),
      markaModel: `${form.marka} ${form.model}`.trim(),
      tur: form.tur,
      durum: form.durum,
      fotoUrl: form.fotoUrl || '',
      yil: form.yil ? Number(form.yil) : null,
      kategori: form.kategori || null,
      koltuk: form.koltuk !== '' && form.koltuk != null ? Number(form.koltuk) : null,
      yakit: form.yakit || null,
      vites: form.vites || null,
      km: form.km !== '' ? Number(form.km) : null,
      sehirTuketim: form.sehirTuketim !== '' ? Number(form.sehirTuketim) : null,
      yolTuketim: form.yolTuketim !== '' ? Number(form.yolTuketim) : null,
      menzil: form.menzil !== '' ? Number(form.menzil) : null,
      kwh: form.kwh !== '' ? Number(form.kwh) : null,
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

        <div className="form-grid-2">
          <div>
            <label className="field-label field-label-top">Plaka</label>
            <input className="text-input" value={form.plaka} onChange={alan('plaka')} placeholder="34 ABC 123" />
          </div>
          <div>
            <label className="field-label field-label-top">Yıl</label>
            <select className="select-input select-block" value={form.yil} onChange={alan('yil')}>
              <option value="">Seçiniz</option>
              {YILLAR.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="field-label field-label-top">Marka</label>
            <select className="select-input select-block" value={form.marka} onChange={markaAlan}>
              <option value="">Seçiniz</option>
              {MARKALAR.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label field-label-top">Model</label>
            <select
              className="select-input select-block"
              value={form.model}
              onChange={alan('model')}
              disabled={!form.marka}
            >
              <option value="">{form.marka ? 'Seçiniz' : 'Önce marka seçin'}</option>
              {modelSecenekleri.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

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
              {Object.entries(VEHICLE_STATUS_LABEL).map(([deger, etiket]) => (
                <option key={deger} value={deger}>{etiket}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="field-label field-label-top">Kategori</label>
            <select className="select-input select-block" value={form.kategori} onChange={alan('kategori')}>
              {Object.entries(VEHICLE_CATEGORY_LABEL).map(([deger, etiket]) => (
                <option key={deger} value={deger}>{etiket}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label field-label-top">Koltuk sayısı</label>
            <input
              type="number"
              min="1"
              max="60"
              className="text-input"
              value={form.koltuk}
              onChange={alan('koltuk')}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="field-label field-label-top">Yakıt tipi</label>
            <select className="select-input select-block" value={form.yakit} onChange={yakitAlan}>
              {Object.entries(FUEL_TYPE_LABEL).map(([deger, etiket]) => (
                <option key={deger} value={deger}>{etiket}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label field-label-top">Vites</label>
            <select className="select-input select-block" value={form.vites} onChange={alan('vites')}>
              {Object.entries(GEARBOX_LABEL).map(([deger, etiket]) => (
                <option key={deger} value={deger}>{etiket}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="field-label field-label-top">Kilometre</label>
            <input type="number" min="0" className="text-input" value={form.km} onChange={alan('km')} />
          </div>
          {form.yakit === 'ELEKTRIK' ? (
            <div>
              <label className="field-label field-label-top">Menzil (km)</label>
              <input type="number" min="0" className="text-input" value={form.menzil} onChange={alan('menzil')} />
            </div>
          ) : (
            <div>
              <label className="field-label field-label-top">Şehir içi (L/100 km)</label>
              <input type="number" min="0" step="0.1" className="text-input" value={form.sehirTuketim} onChange={alan('sehirTuketim')} />
            </div>
          )}
        </div>

        {form.yakit === 'ELEKTRIK' ? (
          <div className="form-grid-2">
            <div>
              <label className="field-label field-label-top">Ortalama tüketim (kWh/100 km)</label>
              <input type="number" min="0" step="0.1" className="text-input" value={form.kwh} onChange={alan('kwh')} />
            </div>
            <div />
          </div>
        ) : (
          <div className="form-grid-2">
            <div>
              <label className="field-label field-label-top">Uzun yol (L/100 km)</label>
              <input type="number" min="0" step="0.1" className="text-input" value={form.yolTuketim} onChange={alan('yolTuketim')} />
            </div>
            <div />
          </div>
        )}

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

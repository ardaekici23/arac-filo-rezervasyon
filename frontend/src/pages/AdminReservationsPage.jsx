import { useMemo, useState } from 'react';
import { useFleetData } from '../context/FleetDataContext';
import { useToast } from '../context/ToastContext';
import { reservationsApi } from '../api/reservations';
import { ApiError } from '../api/client';
import { RESERVATION_STATUS_CLASS, RESERVATION_STATUS_LABEL } from '../domain/constants';
import { gunFarki, trTarih } from '../domain/dates';

const SEKMELER = [
  { anahtar: 'PLANLANDI', etiket: 'Planlandı' },
  { anahtar: 'DEVAM_EDIYOR', etiket: 'Devam Ediyor' },
  { anahtar: 'TAMAMLANDI', etiket: 'Tamamlandı' },
  { anahtar: 'IPTAL', etiket: 'İptal' },
  { anahtar: 'TUMU', etiket: 'Tümü' },
];

export default function AdminReservationsPage() {
  const { araclar, rezervasyonlar, veriYukle } = useFleetData();
  const { duyur } = useToast();
  const [sekme, setSekme] = useState('PLANLANDI');

  const arac = (id) => araclar.find((v) => v.id === id) || null;

  const filtreli = useMemo(() => {
    return rezervasyonlar
      .filter((r) => (sekme === 'TUMU' ? true : r.durum === sekme))
      .sort((a, b) => (a.baslangicTarihi < b.baslangicTarihi ? 1 : -1));
  }, [rezervasyonlar, sekme]);

  const durumDegistir = async (id, durum) => {
    try {
      await reservationsApi.updateStatus(id, durum);
      duyur(durum === 'IPTAL' ? 'Rezervasyon iptal edildi.' : 'Durum güncellendi.', durum === 'IPTAL' ? 'uyari' : 'basari');
      await veriYukle();
    } catch (e) {
      duyur(e instanceof ApiError ? e.message : 'Sunucuya ulaşılamadı.', 'hata');
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Tüm Rezervasyonlar</h1>
      <div className="tabs-row">
        {SEKMELER.map((s) => (
          <button
            key={s.anahtar}
            type="button"
            className={`tab-pill ${sekme === s.anahtar ? 'tab-pill-active' : ''}`}
            onClick={() => setSekme(s.anahtar)}
          >
            {s.etiket}
          </button>
        ))}
      </div>

      <div className="card table-card">
        <div className="table-row table-head admin-res-cols">
          <div>Personel</div><div>Plaka</div><div>Tarih aralığı</div><div>Gün</div><div>Durum</div><div className="align-right">İşlem</div>
        </div>
        {filtreli.map((r) => {
          const v = arac(r.aracId);
          return (
            <div key={r.id} className="table-row admin-res-cols">
              <div>
                <div className="row-strong">{r.kullaniciAdi}</div>
                <div className="row-sub">{v ? v.markaModel : 'Silinmiş araç'}</div>
              </div>
              <div className="row-plate">{v ? v.plaka : '—'}</div>
              <div className="muted-note">{trTarih(r.baslangicTarihi)} → {trTarih(r.bitisTarihi)}</div>
              <div className="muted-note">{gunFarki(r.baslangicTarihi, r.bitisTarihi)}</div>
              <div><span className={RESERVATION_STATUS_CLASS[r.durum]}>{RESERVATION_STATUS_LABEL[r.durum]}</span></div>
              <div className="row-actions align-right">
                {r.durum === 'PLANLANDI' && (
                  <>
                    <button type="button" className="btn btn-success btn-sm" onClick={() => durumDegistir(r.id, 'DEVAM_EDIYOR')}>Başlat</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => durumDegistir(r.id, 'IPTAL')}>İptal</button>
                  </>
                )}
                {r.durum === 'DEVAM_EDIYOR' && (
                  <>
                    <button type="button" className="btn btn-success btn-sm" onClick={() => durumDegistir(r.id, 'TAMAMLANDI')}>Tamamla</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => durumDegistir(r.id, 'IPTAL')}>İptal</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {filtreli.length === 0 && <div className="empty-note empty-note-center">Bu sekmede kayıt yok.</div>}
      </div>
    </div>
  );
}

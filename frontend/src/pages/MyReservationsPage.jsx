import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFleetData } from '../context/FleetDataContext';
import { useToast } from '../context/ToastContext';
import { reservationsApi } from '../api/reservations';
import { ApiError } from '../api/client';
import ReservationDetailModal from '../components/ReservationDetailModal';
import { RESERVATION_STATUS_CLASS, RESERVATION_STATUS_LABEL } from '../domain/constants';
import { bugunIso, gunFarki, trTarih } from '../domain/dates';

const SEKMELER = [
  { anahtar: 'aktif', etiket: 'Aktif' },
  { anahtar: 'gecmis', etiket: 'Geçmiş' },
  { anahtar: 'iptal', etiket: 'İptal edilen' },
];

export default function MyReservationsPage() {
  const { kullanici } = useAuth();
  const { araclar, rezervasyonlar, veriYukle } = useFleetData();
  const { duyur } = useToast();
  const [sekme, setSekme] = useState('aktif');
  const [detayId, setDetayId] = useState(null);

  const arac = (id) => araclar.find((v) => v.id === id) || null;
  const bugun = bugunIso();

  const benimHam = useMemo(
    () => rezervasyonlar.filter((r) => r.kullaniciAdi === kullanici.ad),
    [rezervasyonlar, kullanici.ad]
  );

  const benimFiltreli = useMemo(() => {
    return benimHam
      .filter((r) => {
        if (sekme === 'aktif') return (r.durum === 'BEKLEMEDE' || r.durum === 'ONAYLANDI') && r.bitisTarihi >= bugun;
        if (sekme === 'gecmis') return r.durum === 'TAMAMLANDI' || r.bitisTarihi < bugun;
        return r.durum === 'IPTAL';
      })
      .sort((a, b) => (a.baslangicTarihi < b.baslangicTarihi ? 1 : -1));
  }, [benimHam, sekme, bugun]);

  const iptalEt = async (id) => {
    try {
      await reservationsApi.updateStatus(id, 'IPTAL');
      duyur('Rezervasyon iptal edildi.', 'uyari');
      await veriYukle();
    } catch (e) {
      duyur(e instanceof ApiError ? e.message : 'Sunucuya ulaşılamadı.', 'hata');
    }
  };

  const detayRezervasyon = detayId != null ? benimHam.find((r) => r.id === detayId) || null : null;

  return (
    <div className="page">
      <h1 className="page-title">Rezervasyonlarım</h1>
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

      <div className="list-col">
        {benimFiltreli.map((r) => {
          const v = arac(r.aracId);
          const iptalEdilebilir = r.durum === 'BEKLEMEDE' || r.durum === 'ONAYLANDI';
          return (
            <div
              key={r.id}
              className="card reservation-row reservation-row-clickable"
              onClick={() => setDetayId(r.id)}
            >
              <div>
                <div className="row-plate">{v ? v.plaka : '—'}</div>
                <div className="row-sub">{v ? v.markaModel : 'Silinmiş araç'}</div>
              </div>
              <div>
                <div className="row-strong">{trTarih(r.baslangicTarihi)} → {trTarih(r.bitisTarihi)}</div>
                <div className="row-sub">{gunFarki(r.baslangicTarihi, r.bitisTarihi)} gün · Talep {trTarih(r.olusturmaTarihi?.slice(0, 10))}</div>
              </div>
              <span className={RESERVATION_STATUS_CLASS[r.durum]}>{RESERVATION_STATUS_LABEL[r.durum]}</span>
              {iptalEdilebilir ? (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={(e) => { e.stopPropagation(); iptalEt(r.id); }}
                >
                  İptal et
                </button>
              ) : <span />}
            </div>
          );
        })}
        {benimFiltreli.length === 0 && <div className="empty-note empty-note-center">Bu sekmede kayıt yok.</div>}
      </div>

      {detayRezervasyon && (
        <ReservationDetailModal
          rezervasyon={detayRezervasyon}
          arac={arac(detayRezervasyon.aracId)}
          onaylanabilir={false}
          iptalEdilebilir={detayRezervasyon.durum === 'BEKLEMEDE' || detayRezervasyon.durum === 'ONAYLANDI'}
          onIptal={() => { iptalEt(detayRezervasyon.id); setDetayId(null); }}
          onClose={() => setDetayId(null)}
        />
      )}
    </div>
  );
}

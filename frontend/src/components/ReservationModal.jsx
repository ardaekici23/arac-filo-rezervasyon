import { useMemo, useState } from 'react';
import MonthCalendar from './MonthCalendar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useFleetData } from '../context/FleetDataContext';
import { reservationsApi } from '../api/reservations';
import { ApiError } from '../api/client';
import { doluGunler, aralikTemizMi } from '../domain/occupancy';
import { gunFarki, trTarih } from '../domain/dates';
import { RESERVATION_STATUS_CLASS, RESERVATION_STATUS_LABEL, VEHICLE_TYPE_LABEL } from '../domain/constants';

export default function ReservationModal({ arac, onClose, onCreated }) {
  const { kullanici } = useAuth();
  const { duyur } = useToast();
  const { rezervasyonlar, veriYukle } = useFleetData();

  const today = new Date();
  const [yil, setYil] = useState(today.getFullYear());
  const [ay, setAy] = useState(today.getMonth());
  const [secimBas, setSecimBas] = useState(null);
  const [secimBit, setSecimBit] = useState(null);
  const [amac, setAmac] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const dolu = useMemo(() => doluGunler(rezervasyonlar, arac.id), [rezervasyonlar, arac.id]);

  const gecmis = useMemo(
    () =>
      rezervasyonlar
        .filter((r) => r.aracId === arac.id)
        .sort((a, b) => (a.baslangicTarihi < b.baslangicTarihi ? 1 : -1)),
    [rezervasyonlar, arac.id]
  );

  const gunTikla = (gunIso) => {
    if (!secimBas || secimBit || gunIso < secimBas) {
      setSecimBas(gunIso);
      setSecimBit(null);
      return;
    }
    if (!aralikTemizMi(secimBas, gunIso, dolu)) {
      duyur('Seçtiğin aralıkta dolu gün var. Daha kısa bir aralık seç.', 'hata');
      setSecimBas(gunIso);
      setSecimBit(null);
      return;
    }
    setSecimBit(gunIso);
  };

  const temizle = () => {
    setSecimBas(null);
    setSecimBit(null);
  };

  const olustur = async () => {
    if (!secimBas) return;
    setGonderiliyor(true);
    try {
      const kayit = await reservationsApi.create({
        aracId: arac.id,
        kullaniciAdi: kullanici.ad,
        baslangicTarihi: secimBas,
        bitisTarihi: secimBit || secimBas,
        amac,
      });
      await veriYukle();
      temizle();
      setAmac('');
      onCreated?.({
        arac: `${arac.markaModel} · ${arac.plaka}`,
        aralik: `${trTarih(secimBas)} → ${trTarih(secimBit || secimBas)}`,
        no: kayit?.id,
      });
    } catch (e) {
      const mesaj = e instanceof ApiError ? e.message : 'Sunucuya ulaşılamadı.';
      duyur(mesaj, 'hata');
    } finally {
      setGonderiliyor(false);
    }
  };

  const secimGun = secimBas ? gunFarki(secimBas, secimBit || secimBas) : 0;
  const olusturPasif = !secimBas || gonderiliyor;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-head-row">
              <span className="plate-badge">{arac.plaka}</span>
              <span className="modal-title">{arac.markaModel}</span>
            </div>
            <div className="modal-sub">{VEHICLE_TYPE_LABEL[arac.tur] || arac.tur}</div>
          </div>
          <button type="button" className="icon-btn" aria-label="Kapat" onClick={onClose}>✕</button>
        </div>

        {arac.fotoUrl && <img className="modal-photo" src={arac.fotoUrl} alt={arac.markaModel} />}

        <div className="modal-body-grid">
          <div className="modal-col-main">
            <MonthCalendar
              yil={yil}
              ay={ay}
              onAyDegistir={([y, a]) => { setYil(y); setAy(a); }}
              doluSet={dolu}
              secimBas={secimBas}
              secimBit={secimBit}
              onGunTikla={gunTikla}
            />

            <div className="history-block">
              <div className="history-title">Bu aracın geçmişi</div>
              <div className="history-list">
                {gecmis.map((r) => (
                  <div key={r.id} className="history-item">
                    <div className="history-item-row">
                      <span className="history-range">{trTarih(r.baslangicTarihi)} → {trTarih(r.bitisTarihi)}</span>
                      <span className={RESERVATION_STATUS_CLASS[r.durum]}>{RESERVATION_STATUS_LABEL[r.durum]}</span>
                    </div>
                    <div className="history-user">{r.kullaniciAdi}</div>
                  </div>
                ))}
                {gecmis.length === 0 && <div className="empty-note">Bu araç için kayıt yok.</div>}
              </div>
            </div>
          </div>

          <div className="modal-col-side">
            <div className="side-title">Seçimin</div>
            <div className="card summary-card">
              <div className="summary-row">
                <span className="summary-label">Alış</span>
                <span className="summary-value">{secimBas ? trTarih(secimBas) : '—'}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row">
                <span className="summary-label">Teslim</span>
                <span className="summary-value">{secimBit ? trTarih(secimBit) : (secimBas ? trTarih(secimBas) : '—')}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row">
                <span className="summary-label">Toplam</span>
                <span className="summary-total">{secimGun ? `${secimGun} gün` : '—'}</span>
              </div>
            </div>

            <div className="hint-text">
              {!secimBas
                ? 'Başlangıç günü için takvimden boş bir gün seç.'
                : !secimBit
                  ? 'Şimdi bitiş gününü seç. Taralı günler dolu olduğu için seçilemez.'
                  : 'Aralık hazır. Talebi oluşturabilirsin.'}
            </div>

            <label className="field-label field-label-top">Amaç (opsiyonel)</label>
            <textarea
              className="text-area"
              value={amac}
              onChange={(e) => setAmac(e.target.value)}
              placeholder="Örn. İzmir saha ziyareti"
            />

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={temizle}>Temizle</button>
              <button type="button" className="btn btn-dark" disabled={olusturPasif} onClick={olustur}>
                {gonderiliyor ? 'Gönderiliyor…' : 'Rezervasyon oluştur'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

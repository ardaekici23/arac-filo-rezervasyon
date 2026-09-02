import { useMemo } from 'react';
import { useFleetData } from '../context/FleetDataContext';
import { useToast } from '../context/ToastContext';
import { reservationsApi } from '../api/reservations';
import { ApiError } from '../api/client';
import { doluGunler } from '../domain/occupancy';
import { AY_ADLARI, RESERVATION_STATUS_CLASS, RESERVATION_STATUS_LABEL } from '../domain/constants';
import { bugunIso, trTarih } from '../domain/dates';

export default function AdminDashboardPage() {
  const { araclar, rezervasyonlar, veriYukle } = useFleetData();
  const { duyur } = useToast();
  const today = new Date();
  const bugun = bugunIso();

  const veriler = useMemo(() => {
    const aktifSayi = rezervasyonlar.filter(
      (r) => (r.durum === 'BEKLEMEDE' || r.durum === 'ONAYLANDI') && r.bitisTarihi >= bugun
    ).length;
    const bakimdaki = araclar.filter((v) => v.durum === 'BAKIMDA').length;

    const ayGun = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dolulukSatirlari = araclar
      .map((v) => {
        let n = 0;
        doluGunler(rezervasyonlar, v.id).forEach((k) => {
          const d = new Date(k);
          if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()) n++;
        });
        const oran = Math.round((n / ayGun) * 100);
        return { plaka: v.plaka, oran };
      })
      .sort((a, b) => b.oran - a.oran);

    const ortalamaDoluluk = dolulukSatirlari.length
      ? Math.round(dolulukSatirlari.reduce((t, d) => t + d.oran, 0) / dolulukSatirlari.length)
      : 0;

    const onayBekleyenler = rezervasyonlar
      .filter((r) => r.durum === 'BEKLEMEDE')
      .sort((a, b) => (a.olusturmaTarihi < b.olusturmaTarihi ? 1 : -1))
      .slice(0, 5);

    return { aktifSayi, bakimdaki, dolulukSatirlari, ortalamaDoluluk, onayBekleyenler };
  }, [araclar, rezervasyonlar, bugun, today]);

  const arac = (id) => araclar.find((v) => v.id === id) || null;

  const durumDegistir = async (id, durum) => {
    try {
      await reservationsApi.updateStatus(id, durum);
      duyur(durum === 'IPTAL' ? 'Rezervasyon iptal edildi.' : 'Durum güncellendi.', durum === 'IPTAL' ? 'uyari' : 'basari');
      await veriYukle();
    } catch (e) {
      duyur(e instanceof ApiError ? e.message : 'Sunucuya ulaşılamadı.', 'hata');
    }
  };

  const kpiler = [
    { etiket: 'Toplam araç', deger: araclar.length, alt: `${veriler.bakimdaki} tanesi bakımda` },
    { etiket: 'Aktif rezervasyon', deger: veriler.aktifSayi, alt: 'Planlı ve devam eden' },
    { etiket: 'Onay bekleyen', deger: rezervasyonlar.filter((r) => r.durum === 'BEKLEMEDE').length, alt: 'İncelemeni bekliyor' },
    { etiket: 'Ortalama doluluk', deger: `%${veriler.ortalamaDoluluk}`, alt: `${AY_ADLARI[today.getMonth()]} ayı` },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Genel Bakış</h1>
      <div className="kpi-grid">
        {kpiler.map((k) => (
          <div key={k.etiket} className="card kpi-card">
            <div className="kpi-label">{k.etiket}</div>
            <div className="kpi-value">{k.deger}</div>
            <div className="kpi-alt">{k.alt}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card panel">
          <h2 className="panel-title">Araç bazında doluluk (bu ay)</h2>
          <div className="occupancy-list">
            {veriler.dolulukSatirlari.map((d) => (
              <div key={d.plaka} className="occupancy-row">
                <div className="occupancy-plate">{d.plaka}</div>
                <div className="occupancy-track">
                  <div
                    className="occupancy-bar"
                    style={{
                      width: `${Math.max(d.oran, 2)}%`,
                      background: d.oran > 60 ? '#B42318' : d.oran > 30 ? '#C27803' : '#1F4FD8',
                    }}
                  />
                </div>
                <div className="occupancy-pct">%{d.oran}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card panel">
          <h2 className="panel-title">Onay bekleyenler</h2>
          <div className="request-list">
            {veriler.onayBekleyenler.map((r) => {
              const v = arac(r.aracId);
              return (
                <div key={r.id} className="request-card">
                  <div className="request-head">
                    <span className="request-user">{r.kullaniciAdi}</span>
                    <span className="request-plate">{v ? v.plaka : '—'}</span>
                  </div>
                  <div className="request-range">{trTarih(r.baslangicTarihi)} → {trTarih(r.bitisTarihi)}</div>
                  <div className="request-actions">
                    <span className={RESERVATION_STATUS_CLASS[r.durum]}>{RESERVATION_STATUS_LABEL[r.durum]}</span>
                    <button type="button" className="btn btn-success btn-sm" onClick={() => durumDegistir(r.id, 'ONAYLANDI')}>Onayla</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => durumDegistir(r.id, 'IPTAL')}>Reddet</button>
                  </div>
                </div>
              );
            })}
            {veriler.onayBekleyenler.length === 0 && <div className="empty-note">Bekleyen talep yok.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

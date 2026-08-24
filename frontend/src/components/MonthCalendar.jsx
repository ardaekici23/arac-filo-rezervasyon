import { useState } from 'react';
import { AY_ADLARI, GUN_BASLIK } from '../domain/constants';
import { bugunIso, iso } from '../domain/dates';

function hucreDurumu({ gunIso, bugun, doluSet, secimBas, secimBit, hoverGun }) {
  if (gunIso < bugun) return 'gecmis';
  if (doluSet.has(gunIso)) return 'dolu';
  if (gunIso === secimBas || gunIso === secimBit) return 'secili';
  if (secimBas && secimBit && gunIso > secimBas && gunIso < secimBit) return 'aralik';
  if (!secimBit && secimBas && hoverGun && gunIso > secimBas && gunIso <= hoverGun) return 'onizleme';
  if (gunIso === bugun) return 'bugun';
  return 'bos';
}

const IPUCU = {
  gecmis: 'Geçmiş tarih',
  dolu: 'Bu gün dolu',
  secili: 'Seçili gün',
  aralik: 'Seçilen aralık',
  onizleme: 'Önizleme',
  bugun: 'Bugün',
  bos: 'Müsait',
};

export default function MonthCalendar({
  yil,
  ay,
  onAyDegistir,
  doluSet = new Set(),
  secimBas = null,
  secimBit = null,
  onGunTikla = null,
}) {
  const [hoverGun, setHoverGun] = useState(null);
  const interaktif = !!onGunTikla;
  const bugun = bugunIso();

  const ilkGun = new Date(yil, ay, 1);
  const bosluk = (ilkGun.getDay() + 6) % 7;
  const gunSayisi = new Date(yil, ay + 1, 0).getDate();

  const hucreler = [];
  for (let i = 0; i < bosluk; i++) {
    hucreler.push({ key: `b${i}`, gun: '', durum: 'bos-ay', pasif: true });
  }
  for (let g = 1; g <= gunSayisi; g++) {
    const gunIso = iso(new Date(yil, ay, g));
    const durum = hucreDurumu({ gunIso, bugun, doluSet, secimBas, secimBit, hoverGun });
    const pasif = !interaktif || durum === 'gecmis' || durum === 'dolu';
    hucreler.push({ key: gunIso, gun: g, durum, pasif, gunIso });
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-title">{AY_ADLARI[ay]} {yil}</div>
        {onAyDegistir && (
          <div className="calendar-nav">
            <button
              type="button"
              className="icon-btn"
              aria-label="Önceki ay"
              onClick={() => onAyDegistir(ay === 0 ? [yil - 1, 11] : [yil, ay - 1])}
            >
              ‹
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Sonraki ay"
              onClick={() => onAyDegistir(ay === 11 ? [yil + 1, 0] : [yil, ay + 1])}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="calendar-grid calendar-weekdays">
        {GUN_BASLIK.map((b) => (
          <div key={b} className="weekday">{b}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {hucreler.map((h) => (
          <button
            key={h.key}
            type="button"
            disabled={h.pasif}
            title={h.durum === 'bos-ay' ? '' : IPUCU[h.durum]}
            className={`day-cell day-${h.durum}`}
            onMouseEnter={() => {
              if (!h.pasif && secimBas && !secimBit) setHoverGun(h.gunIso);
            }}
            onClick={() => {
              if (!h.pasif) onGunTikla(h.gunIso);
            }}
          >
            {h.gun}
          </button>
        ))}
      </div>

      <div className="calendar-legend">
        <span className="legend-item"><span className="legend-swatch swatch-bos" />Boş</span>
        <span className="legend-item"><span className="legend-swatch swatch-dolu" />Dolu</span>
        {interaktif && <span className="legend-item"><span className="legend-swatch swatch-secili" />Seçilen</span>}
        {interaktif && <span className="legend-item"><span className="legend-swatch swatch-aralik" />Aralık</span>}
        <span className="legend-item"><span className="legend-swatch swatch-gecmis" />Geçmiş</span>
      </div>
    </div>
  );
}

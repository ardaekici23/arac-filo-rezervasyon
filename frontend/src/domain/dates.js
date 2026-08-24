import { AY_ADLARI } from './constants';

export function iso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function ayir(isoStr) {
  const [y, m, d] = String(isoStr).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function gunEkle(date, n) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + n);
  return next;
}

export function trTarih(isoStr) {
  if (!isoStr) return '—';
  const d = ayir(isoStr);
  return `${d.getDate()} ${AY_ADLARI[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

export function gunFarki(basIso, bitIso) {
  return Math.round((ayir(bitIso) - ayir(basIso)) / 86400000) + 1;
}

export function bugunIso() {
  return iso(new Date());
}

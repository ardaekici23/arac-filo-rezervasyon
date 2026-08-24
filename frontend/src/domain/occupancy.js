import { ayir, gunEkle, iso } from './dates';

export function doluGunler(rezervasyonlar, aracId) {
  const set = new Set();
  rezervasyonlar.forEach((r) => {
    if (r.aracId !== aracId || r.durum === 'IPTAL') return;
    if (!r.baslangicTarihi || !r.bitisTarihi) return;
    let d = ayir(r.baslangicTarihi);
    const son = ayir(r.bitisTarihi);
    let guvenlik = 0;
    while (d <= son && guvenlik < 400) {
      set.add(iso(d));
      d = gunEkle(d, 1);
      guvenlik += 1;
    }
  });
  return set;
}

export function aralikTemizMi(basIso, bitIso, doluSet) {
  let d = ayir(basIso);
  const son = ayir(bitIso);
  while (d <= son) {
    if (doluSet.has(iso(d))) return false;
    d = gunEkle(d, 1);
  }
  return true;
}

export const MARKALAR = [
  'Audi', 'BMW', 'Citroën', 'Dacia', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Kia',
  'Mercedes-Benz', 'Nissan', 'Opel', 'Peugeot', 'Renault', 'SEAT', 'Škoda',
  'Togg', 'Toyota', 'Volkswagen', 'Volvo',
];

export const MARKA_MODELLER = {
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5'],
  BMW: ['1 Serisi', '3 Serisi', '5 Serisi', 'X1', 'X3'],
  Citroën: ['C3', 'C4', 'Berlingo', 'Jumpy'],
  Dacia: ['Sandero', 'Duster', 'Jogger', 'Dokker'],
  Fiat: ['Egea', 'Doblo', 'Fiorino', 'Ducato'],
  Ford: ['Fiesta', 'Focus', 'Kuga', 'Transit', 'Tourneo Custom'],
  Honda: ['Civic', 'City', 'CR-V', 'HR-V'],
  Hyundai: ['i20', 'i30', 'Elantra', 'Tucson', 'Bayon'],
  Kia: ['Ceed', 'Rio', 'Sportage', 'Stonic'],
  'Mercedes-Benz': ['A-Serisi', 'C-Serisi', 'E-Serisi', 'Vito', 'Sprinter'],
  Nissan: ['Micra', 'Qashqai', 'X-Trail', 'Juke'],
  Opel: ['Corsa', 'Astra', 'Grandland', 'Combo'],
  Peugeot: ['208', '301', '308', '2008', 'Partner'],
  Renault: ['Clio', 'Megane', 'Taliant', 'Captur', 'Trafic', 'Master'],
  SEAT: ['Ibiza', 'Leon', 'Arona', 'Ateca'],
  Škoda: ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq'],
  Togg: ['T10X', 'T10F'],
  Toyota: ['Corolla', 'Corolla Hybrid', 'C-HR', 'RAV4', 'Proace'],
  Volkswagen: ['Polo', 'Golf', 'Passat', 'T-Roc', 'Tiguan', 'Caddy', 'Transporter'],
  Volvo: ['S60', 'V60', 'XC40', 'XC60'],
};

export const YILLAR = (() => {
  const enYuksek = new Date().getFullYear() + 1;
  const liste = [];
  for (let y = enYuksek; y >= 2010; y--) liste.push(y);
  return liste;
})();

// Backend "markaModel" tek bir string alanı olduğu için, düzenlerken bu string'i
// marka/model dropdown'larına geri ayrıştırmamız gerekiyor.
export function markaModelAyristir(markaModel) {
  const s = (markaModel || '').trim();
  if (!s) return { marka: '', model: '' };
  const marka = MARKALAR.find((m) => s === m || s.startsWith(`${m} `));
  if (!marka) return { marka: '', model: '' };
  return { marka, model: s.slice(marka.length).trim() };
}

export function modelSecenekleriGetir(marka, mevcutModel) {
  const liste = MARKA_MODELLER[marka] || [];
  if (mevcutModel && !liste.includes(mevcutModel)) return [mevcutModel, ...liste];
  return liste;
}

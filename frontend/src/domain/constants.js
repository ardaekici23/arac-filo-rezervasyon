export const AY_ADLARI = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export const GUN_BASLIK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export const VEHICLE_TYPE_LABEL = { BINEK: 'Binek', TICARI: 'Ticari' };

export const VEHICLE_STATUS_LABEL = { MUSAIT: 'Müsait', BAKIMDA: 'Bakımda', PASIF: 'Pasif' };

export const VEHICLE_STATUS_CLASS = {
  MUSAIT: 'chip chip-green',
  BAKIMDA: 'chip chip-amber',
  PASIF: 'chip chip-gray',
};

export const VEHICLE_CATEGORY_LABEL = {
  SEDAN: 'Sedan',
  HATCHBACK: 'Hatchback',
  SUV: 'SUV',
  MINIBUS: 'Minibüs',
  TICARI: 'Ticari',
  STATION_WAGON: 'Station Wagon',
};
export const VEHICLE_CATEGORY_OPTIONS = Object.keys(VEHICLE_CATEGORY_LABEL);

export const FUEL_TYPE_LABEL = {
  BENZIN: 'Benzin',
  DIZEL: 'Dizel',
  HIBRIT: 'Hibrit',
  LPG: 'LPG',
  ELEKTRIK: 'Elektrik',
};
export const FUEL_TYPE_OPTIONS = Object.keys(FUEL_TYPE_LABEL);

export const GEARBOX_LABEL = { OTOMATIK: 'Otomatik', MANUEL: 'Manuel' };
export const GEARBOX_OPTIONS = Object.keys(GEARBOX_LABEL);

export const RESERVATION_STATUS_LABEL = {
  BEKLEMEDE: 'Beklemede',
  ONAYLANDI: 'Onaylandı',
  TAMAMLANDI: 'Tamamlandı',
  IPTAL: 'İptal',
};

export const RESERVATION_STATUS_CLASS = {
  BEKLEMEDE: 'chip chip-amber',
  ONAYLANDI: 'chip chip-blue',
  TAMAMLANDI: 'chip chip-gray',
  IPTAL: 'chip chip-red',
};

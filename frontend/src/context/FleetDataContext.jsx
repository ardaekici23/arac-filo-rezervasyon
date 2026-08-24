import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { vehiclesApi } from '../api/vehicles';
import { reservationsApi } from '../api/reservations';

const FleetDataContext = createContext(null);

export function FleetDataProvider({ children }) {
  const [araclar, setAraclar] = useState([]);
  const [rezervasyonlar, setRezervasyonlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  const veriYukle = useCallback(async () => {
    setYukleniyor(true);
    try {
      const [a, r] = await Promise.all([vehiclesApi.list(), reservationsApi.list()]);
      setAraclar(a);
      setRezervasyonlar(r);
      setHata(null);
    } catch (e) {
      setHata(e.message || 'Sunucuya ulaşılamadı');
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    veriYukle();
  }, [veriYukle]);

  return (
    <FleetDataContext.Provider value={{ araclar, rezervasyonlar, yukleniyor, hata, veriYukle }}>
      {children}
    </FleetDataContext.Provider>
  );
}

export function useFleetData() {
  const ctx = useContext(FleetDataContext);
  if (!ctx) throw new Error('useFleetData, FleetDataProvider içinde kullanılmalı');
  return ctx;
}

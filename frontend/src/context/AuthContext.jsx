import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'filorez.kullanici';

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (kullanici) localStorage.setItem(STORAGE_KEY, JSON.stringify(kullanici));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage erişilemezse sessizce devam et
    }
  }, [kullanici]);

  const girisYap = (kullaniciBilgisi) => setKullanici(kullaniciBilgisi);
  const cikisYap = () => setKullanici(null);

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalı');
  return ctx;
}

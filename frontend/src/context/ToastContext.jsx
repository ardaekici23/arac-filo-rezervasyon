import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const duyur = useCallback((mesaj, tur = 'bilgi') => {
    clearTimeout(timerRef.current);
    setToast({ mesaj, tur });
    timerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ duyur }}>
      {children}
      {toast && (
        <div className="toast-wrap">
          <div className={`toast toast-${toast.tur}`}>{toast.mesaj}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast, ToastProvider içinde kullanılmalı');
  return ctx;
}

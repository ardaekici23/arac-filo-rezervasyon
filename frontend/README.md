# Frontend (placeholder)

Bu klasör bilinçli olarak boş bırakıldı — React + Vite kurulumu bir sonraki oturumda yapılacak.

## Planlanan yapı

- `package.json`, `vite.config.js`
- `src/main.jsx`, `src/App.jsx`
- `src/api/client.js` — backend'e `fetch` ile bağlanan wrapper (`VITE_API_BASE_URL` env değişkeninden okunur)
- `src/components/` — `VehicleList`, `ReservationForm`, `ReservationList`
- `Dockerfile` — `node:20-alpine` üzerinde `npm run dev -- --host`

Kurulduktan sonra kök dizindeki `docker-compose.yml` dosyasına `frontend` servisi eklenecek (dosyanın sonunda örnek yapılandırma yorum satırı olarak zaten mevcut).

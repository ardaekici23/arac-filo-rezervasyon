# Frontend

React + Vite arayüzü. `Araç Kiralama Arayüzü.dc.html` tasarımından, gerçek backend
kontratına (bkz. `../CLAUDE.md`) uyarlanarak uygulandı.

## Çalıştırma

```
npm install
npm run dev        # http://localhost:5173
```

Backend'in `http://localhost:8080` üzerinde ayakta olması ve `application.yml`
içindeki `app.cors.allowed-origins` değerinin `http://localhost:5173`'ü
kapsaması gerekir (varsayılan zaten öyle).

`VITE_API_BASE_URL` env değişkeni backend adresini belirler (bkz. `.env.example`).

## Yapı

- `src/api/` — backend'e `fetch` ile bağlanan istemciler (`client.js`, `vehicles.js`, `reservations.js`)
- `src/context/` — `AuthProvider` (sadece istemci tarafı rol seçimi — backend'de auth yok),
  `FleetDataProvider` (araç/rezervasyon verisini tek yerden çekip paylaşır), `ToastProvider`
- `src/domain/` — Türkçe alan adları, tarih yardımcıları, doluluk hesaplama
- `src/components/` — `Header`, `MonthCalendar`, `ReservationModal`, `VehicleFormModal`
- `src/pages/` — rota başına bir sayfa (Landing, Giriş, Araçlar, Rezervasyonlarım, Admin/*)

## Bilinen sınırlamalar

- Şifreler gerçek (backend'de BCrypt ile hashlenip saklanıyor, bkz.
  `POST /api/kullanicilar/kayit` ve `/giris`), ama oturum/token yok — giriş
  başarılı olduğunda dönen kullanıcı sadece localStorage'da tutulur. Bu,
  API'nin kendisini kısıtlamaz — sadece arayüzde hangi sayfaların/menülerin
  gösterileceğini belirler; `/api/araclar` gibi uçlara rolden bağımsız
  erişilebilir.
- Demo hesaplar (`elif@sirket.com` / `admin@sirket.com`, şifre `123456`)
  backend her açıldığında yoksa oluşturulur (`DemoUserSeeder`).
- Araç modeli backend'de `plaka`, `markaModel`, `tur` (BINEK/TICARI),
  `durum` (AKTIF/BAKIMDA), `fotoUrl` (opsiyonel) alanlarından oluşur —
  tasarımdaki yıl, koltuk sayısı, yakıt tipi gibi alanların backend'de
  karşılığı olmadığı için uygulanmadı. `fotoUrl` design'daki mekanizmayla
  aynı şekilde çalışır: bir URL yapıştırılabilir veya bir dosya seçilip
  tarayıcıda base64 data URI'ye çevrilerek aynı metin alanına yazılır
  (4 MB üstü dosyalar reddedilir) — ayrı bir dosya depolama/upload
  endpoint'i yok, `araclar.foto_url` tek bir TEXT kolonu.
- Rezervasyon durumları `PLANLANDI / DEVAM_EDIYOR / TAMAMLANDI / IPTAL` —
  tasarımdaki onay bekleme akışı (`BEKLEMEDE/ONAYLANDI`) yerine gerçek enum
  kullanıldı; admin panelinde durum geçişleri buna göre kurgulandı.

## Dockerfile

`node:20-alpine` üzerinde `npm run dev -- --host`. `docker-compose.yml`'deki
`frontend` servisi bunu kullanır.

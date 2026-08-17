# Araç Filo / Zimmet Rezervasyon Sistemi — Staj Proje Dokümanı

> **Amaç:** Şirket araçlarının belirli tarih aralıklarında rezerve edildiği, aynı aracın çakışan tarihlerde iki kez ayrılmasının engellendiği, müsait araçların listelendiği **backend'li bir web uygulaması** geliştirmek.
> **Gerçek hayat karşılığı:** Şirket filo yönetimi, araç zimmet/rezervasyon takibi, "hangi araç ne zaman kimde?" sorusunun sistemli cevabı.

---

## 1. Proje Hakkında

Bu uygulama, bir çalışanın **"12–15 Temmuz arası müşteri ziyareti için bir araç lazım"** demesini ve o tarihlerde **müsait** bir aracı sistemli şekilde rezerve etmesini sağlar. Sistemin en kritik görevi ise **"Bu araç o tarihlerde zaten alınmış mı?"** sorusuna doğru cevap vererek **aynı aracın çakışan tarihlerde ikinci kez ayrılmasını engellemektir.**

Bu proje **mutlaka bir backend (sunucu) ve veritabanı** içerecektir. Yani veriler tarayıcıda değil, gerçek bir veritabanında saklanır ve frontend, backend'e bir **API** üzerinden bağlanır. Rezervasyon çakışma kontrolü gibi kritik iş kuralları **backend'de** çalışır. Bu, gerçek dünyadaki uygulamaların çalışma şeklidir.

Proje özellikleri **iki grupta** tanımlanmıştır:

- 🟢 **Öncelikli (Yapılması Gerekenler):** Herkesin bitirmesi beklenen temel uygulama. Backend + veritabanı + **React ile arayüz** + çakışma kontrolü dahildir. **React arayüz geliştirme artık önceliklidir ve zorunludur** (aşağıya bakınız).
- 🔵 **Opsiyonel (İsteğe Bağlı):** Öncelikliler bittikten sonra eklenebilecek ek özellikler.

> **Kural:** Önce öncelikli özellikler tamamlanır, uygulama uçtan uca (frontend → backend → veritabanı) ÇALIŞIR hale gelir. Ancak ondan sonra opsiyonel özelliklere geçilir. Yarım kalan 10 özellik yerine, tam çalışan 5 özellik her zaman daha değerlidir.

---

## 2. Kazanımlar (Neler Öğrenilecek?)

| Konu | Nerede öğrenilir |
|------|------------------|
| HTML form, tablo, buton | Arayüz tasarımı |
| CSS ile düzen (layout) | Ekranların görünümü |
| JavaScript ile veri işleme | Ekle/sil/güncelle |
| CRUD mantığı (Create-Read-Update-Delete) | Araç ve rezervasyon kayıtları |
| **Backend / sunucu mantığı** | API geliştirme |
| **REST API** (frontend-backend haberleşmesi) | Veri alışverişi |
| **Veritabanı** (tablo, ilişki, sorgu) | Verilerin kalıcı saklanması |
| **Tarih aralığı çakışma kontrolü** | Rezervasyon çakışması engelleme |
| **Müsaitlik hesaplama** | Belirli tarihte boş araç bulma |
| Durum yönetimi (state machine) | Planlandı/Devam/Tamamlandı/İptal |
| Form doğrulama (bitiş > başlangıç) | Tarih mantığı kontrolü |
| Git ile versiyon kontrol | Tüm proje boyunca |
| **React ile modern frontend** | Bileşen mimarisi |
| (Opsiyonel) Takvim görünümü / raporlama | Dolu günlerin görselleştirilmesi |

---

## 3. Teknoloji Seçenekleri

Bu projede **backend zorunludur.** Frontend ve backend için ekibin/mentörün bildiği diller tercih edilir.

### 3.1 Backend (ZORUNLU) — dil serbest
Ekibin bildiği dile göre biri seçilir:

| Dil | Framework | Not |
|-----|-----------|-----|
| **Python** | Django veya Flask | En hızlı başlangıç, öğrenmesi kolay |
| **Java** | Spring Boot | Kurumsal dünyada çok yaygın |
| **C#** | ASP.NET Core | Kurumsal dünyada çok yaygın |
| **Node.js** | Express | Frontend ile aynı dil (JavaScript) |

> Hepsi bu proje için uygundur. Karar tamamen ekibin/mentörün tercihine bağlıdır.

### 3.2 Veritabanı (ZORUNLU)
- **SQLite** → kurulumu en kolay, başlangıç için ideal (önerilen)
- Alternatif: **MySQL / PostgreSQL / SQL Server**

### 3.3 Frontend (ZORUNLU) — React
- 🟢 **Frontend framework: React (ZORUNLU).** Arayüz React ile geliştirilecektir. Backend'e `fetch` (veya benzeri) ile bağlanır.
  - **HTML + CSS + JavaScript** temel bilgi olarak gereklidir; bileşenler bu temel üzerine React ile kurulur.
  - Bileşen yapısı, state yönetimi ve API'den veri çekme React ile yapılır.
  - Takvim görünümü için React ile [FullCalendar React](https://fullcalendar.io/docs/react) veya benzeri kütüphaneler kullanılır.

### 3.4 Takvim / Grafik Kütüphanesi
- Takvim: [FullCalendar React](https://fullcalendar.io/docs/react)
- Grafik / raporlama: React uyumlu bir kütüphane — [Recharts](https://recharts.org/) veya [Chart.js](https://www.chartjs.org/)

> **Özet mimari:**
> `Frontend (React)` → **API (HTTP)** → `Backend (Python/Java/C#/Node)` → `Veritabanı (SQLite vb.)`

---

## 4. Özellikler

### 🟢 4.1 Öncelikli Özellikler (YAPILMASI GEREKENLER)

Bunlar bitmeden opsiyonele geçilmez. **Tümü backend + veritabanı üzerinden çalışacaktır.**

1. **Backend + Veritabanı Kurulumu**
   - Seçilen dilde çalışan bir sunucu ve `araclar` + `rezervasyonlar` tabloları

2. **React ile Frontend Geliştirme**
   - Arayüz React ile geliştirilir: bileşen yapısı, state yönetimi, API'den veri çekme
   - Araç listesi, rezervasyon formu ve rezervasyon listesi React bileşenleri olarak kurulur

3. **REST API**
   - Araç ve rezervasyon için ekle / listele / güncelle / sil uç noktaları (endpoint)
   - Örn: `GET /api/araclar`, `POST /api/rezervasyonlar`

4. **Araç Yönetimi (Ekle / Listele / Güncelle / Sil)**
   - Alanlar: `Plaka`, `Marka/Model`, `Tür` (Binek/Ticari), `Durum` (Aktif/Bakımda)
   - Araç bilgileri backend'e gönderilir ve veritabanına kaydedilir

5. **Rezervasyon Oluşturma (Tarih Aralığı ile)**
   - Alanlar: `Araç`, `Kullanıcı adı`, `Başlangıç tarihi`, `Bitiş tarihi`, `Amaç/Açıklama`
   - Rezervasyon backend'e gönderilir ve veritabanına kaydedilir

6. **⚠️ ÇAKIŞMA KONTROLÜ (KRİTİK ÖZELLİK)**
   - Aynı araç, aynı tarih aralığında **ikinci kez ayrılamaz**
   - Yeni rezervasyon eklenirken backend, o aracın var olan rezervasyonlarıyla tarih çakışması olup olmadığını kontrol eder
   - Çakışma varsa rezervasyon reddedilir ve kullanıcıya uyarı gösterilir
   - **Bu, projenin en önemli iş kuralıdır ve mutlaka backend'de çalışmalıdır.**

7. **Rezervasyon Listeleme**
   - Rezervasyonlar veritabanından çekilir, tabloda gösterilir
   - En yeni en üstte

8. **Rezervasyon İptal**
   - Her satırda "İptal" butonu, iptalden önce onay
   - Rezervasyonun durumu `İptal` olarak işaretlenir (o tarih aralığı tekrar müsait hale gelir)

9. **Müsait Araçları Listeleme (Belirli Tarih Aralığında)**
   - Kullanıcı bir başlangıç ve bitiş tarihi girer
   - Backend, o aralıkta rezervasyonu olmayan (çakışmayan) araçları döner
   - Örn: `GET /api/araclar/musait?baslangic=2026-07-12&bitis=2026-07-15`

10. **Rezervasyon Durumu Yönetimi**
   - Durum akışı: `Planlandı → Devam Ediyor → Tamamlandı` veya `İptal`
   - Duruma göre listede farklı renk/etiket gösterimi

11. **Form Doğrulama**
    - Bitiş tarihi başlangıçtan **sonra** olmalı (bitiş > başlangıç)
    - Boş plaka, boş kullanıcı adı, geçmiş tarih gibi hatalı girişler engellenir

---

### 🔵 4.2 Opsiyonel Özellikler (İSTEĞE BAĞLI)

Öncelikli özellikler bittikten sonra eklenir. Zorluk seviyesine göre gruplandırılmıştır.

#### Kolay Opsiyoneller
- **O1. Araç Türü Filtreleme:** Sadece "Binek" veya "Ticari" araçları göster.
- **O2. Durum Filtreleme:** Sadece "Aktif" araçları ya da "Planlandı" rezervasyonları listele.
- **O3. Arama:** Plakaya veya kullanıcı adına göre arama.
- **O4. Sıralama:** Başlangıç tarihine / plakaya göre artan-azalan sıralama.
- **O5. Boş Durum Ekranı:** Hiç rezervasyon yoksa "Henüz rezervasyon yok" mesajı.
- **O6. Koyu/Açık Tema (Dark Mode):** Tema değiştirme butonu.

#### Orta Opsiyoneller
- **O7. Takvim Görünümü:** Bir aracın dolu (rezerveli) günlerini takvim üzerinde renkli göster.
- **O8. Lokasyon Filtreleme:** Araçlara lokasyon alanı ekleyip lokasyona göre filtrele.
- **O9. Sürücü Ataması:** Rezervasyona bir sürücü ata (isim/telefon).
- **O10. Km / Yakıt Kaydı:** Rezervasyon tamamlanınca çıkış-dönüş km'si ve yakıt bilgisi kaydet.
- **O11. En Çok Kullanılan Araç Raporu / Dashboard:** Hangi araç kaç kez/kaç gün kullanılmış grafiğini göster.
- **O12. CSV Dışa Aktarma:** Rezervasyonları indirilebilir dosya olarak çıkar.
- **O13. Bakım Kaydı:** Araç "Bakımda" iken rezervasyona kapatılır; bakım tarihleri ayrıca tutulur.

#### İleri Opsiyoneller
- **O14. Kullanıcı Girişi (Login):** Kayıt ol / giriş yap, herkes kendi rezervasyonunu görür.
- **O15. Onay Akışı:** Rezervasyon `Talep → Onay/Ret` akışıyla yönetici onayından geçer.
- **O16. Rol Yönetimi:** "Çalışan" talep açar, "Filo Yöneticisi" onaylar/reddeder.
- **O17. E-posta / Hatırlatma Bildirimi:** Rezervasyon başlangıcından önce kullanıcıya hatırlatma gönder.

---

## 5. Veri Modeli

### Bir "Araç" kaydı şu alanları içerir:

| Alan | Tip | Açıklama | Zorunlu |
|------|-----|----------|:------:|
| `id` | Sayı | Benzersiz kimlik | ✅ (otomatik) |
| `plaka` | Metin | Araç plakası (örn. 34 ABC 123) | ✅ |
| `markaModel` | Metin | Marka ve model (örn. Ford Focus) | ✅ |
| `tur` | Metin | Binek / Ticari | ✅ |
| `durum` | Metin | Aktif / Bakımda | ✅ |

### Bir "Rezervasyon" kaydı şu alanları içerir:

| Alan | Tip | Açıklama | Zorunlu |
|------|-----|----------|:------:|
| `id` | Sayı | Benzersiz kimlik | ✅ (otomatik) |
| `aracId` | Sayı | Hangi araç (araclar tablosuna bağlı) | ✅ |
| `kullaniciAdi` | Metin | Rezervasyonu yapan kişi | ✅ |
| `baslangicTarihi` | Tarih | Rezervasyon başlangıcı | ✅ |
| `bitisTarihi` | Tarih | Rezervasyon bitişi | ✅ |
| `amac` | Metin | Amaç / açıklama | ❌ |
| `durum` | Metin | Planlandı / Devam Ediyor / Tamamlandı / İptal | ✅ |
| `olusturmaTarihi` | Tarih-saat | Kaydın oluşturulma anı | ✅ (otomatik) |

### API'den dönen örnek rezervasyon kaydı (JSON):
```json
{
  "id": 1,
  "aracId": 3,
  "plaka": "34 ABC 123",
  "kullaniciAdi": "Ahmet Yılmaz",
  "baslangicTarihi": "2026-07-12",
  "bitisTarihi": "2026-07-15",
  "amac": "İzmir müşteri ziyareti",
  "durum": "Planlandı",
  "olusturmaTarihi": "2026-07-07T12:30:00"
}
```

> **Çakışma kontrolü mantığı (özet):** İki tarih aralığı `[A1, A2]` ve `[B1, B2]` şu koşulda çakışır:
> `A1 <= B2 VE B1 <= A2`. Yeni rezervasyon eklenirken, aynı `arac_id` için `durum != 'İptal'` olan kayıtlarda bu koşul aranır; bulunursa rezervasyon reddedilir.

### Örnek API uç noktaları (endpoint):
| Metot | Yol | İşlev |
|-------|-----|-------|
| `GET` | `/api/araclar` | Tüm araçları listele |
| `GET` | `/api/araclar/{id}` | Tek bir aracı getir |
| `POST` | `/api/araclar` | Yeni araç ekle |
| `PUT` | `/api/araclar/{id}` | Aracı güncelle |
| `DELETE` | `/api/araclar/{id}` | Aracı sil |
| `GET` | `/api/araclar/musait?baslangic=..&bitis=..` | Tarih aralığında müsait araçları listele |
| `GET` | `/api/rezervasyonlar` | Tüm rezervasyonları listele |
| `GET` | `/api/rezervasyonlar/{id}` | Tek bir rezervasyonu getir |
| `POST` | `/api/rezervasyonlar` | Yeni rezervasyon oluştur (çakışma kontrolü burada) |
| `PUT` | `/api/rezervasyonlar/{id}` | Rezervasyonu güncelle / durum değiştir |
| `DELETE` | `/api/rezervasyonlar/{id}` | Rezervasyonu sil / iptal et |

---

## 6. Ekranlar (Arayüz Taslağı)

### 6.1 Ana Ekran (Araç Listesi)
```
+----------------------------------------------------------+
|  🚗 Araç Filo Rezervasyon           [ + Yeni Rezervasyon ]|
+----------------------------------------------------------+
|  Tür: [ Tümü ▼ ]   Durum: [ Aktif ▼ ]                    |
+----------------------------------------------------------+
|  Plaka       | Marka/Model | Tür     | Durum   | ⚙       |
|--------------|-------------|---------|---------|---------|
|  34 ABC 123  | Ford Focus  | Binek   | Aktif   |✏️ 🗑    |
|  34 XYZ 456  | Fiat Doblo  | Ticari  | Aktif   |✏️ 🗑    |
|  06 KLM 789  | Renault Meg | Binek   | Bakımda |✏️ 🗑    |
+----------------------------------------------------------+
|   [ Tarih aralığı gir → Müsait Araçları Göster ]         |
+----------------------------------------------------------+
```

### 6.2 Rezervasyon Formu
```
+-----------------------------------+
|       Yeni Rezervasyon            |
+-----------------------------------+
|  Araç:        [ 34 ABC 123  ▼ ]   |
|  Kullanıcı:   [ Ahmet Yılmaz  ]   |
|  Başlangıç:   [ 12.07.2026    ]   |
|  Bitiş:       [ 15.07.2026    ]   |
|  Amaç:        [_______________]   |
|                                   |
|  ⚠ Seçilen araç bu tarihlerde     |
|    müsait değilse uyarı verilir.  |
|                                   |
|       [ Vazgeç ]  [ Kaydet ]      |
+-----------------------------------+
```

### 6.3 Rezervasyon Takvimi / Liste Görünümü
```
+----------------------------------------------------------+
|  📅 Rezervasyonlar                                        |
+----------------------------------------------------------+
|  Plaka      | Kullanıcı | Tarih Aralığı        | Durum   |
|-------------|-----------|----------------------|---------|
|  34 ABC 123 | Ahmet Y.  | 12.07 → 15.07.2026   |Planlandı|
|  34 XYZ 456 | Merve K.  | 07.07 → 09.07.2026   |Devam Ed.|
|  06 KLM 789 | Can D.    | 01.07 → 03.07.2026   |Tamamlan.|
+----------------------------------------------------------+
|  (Ops O7) Takvim: aracın dolu günleri renkli gösterilir  |
+----------------------------------------------------------+
```

---

## 7. Önerilen Çalışma Sırası (Yol Haritası)

> Aşağıdaki sıralama bir öneridir. **Faz 1, 2 ve 3 önceliklidir** ve mutlaka tamamlanmalıdır (backend + veritabanı + çakışma kontrolü + React ile çalışan arayüz). **Frontend baştan React ile geliştirilir.** Faz 4 opsiyoneldir; ekip önceliklileri bitirdikten sonra, kalan süreye ve isteğe göre bu fazdan seçim yapar.

### 🟢 Faz 1 — Kurulum & React Arayüzü (Öncelikli)
| Adım | Hedef |
|-----|-------|
| 1 | Ortam kurulumu, Git/GitHub hesabı, editör (VS Code) |
| 2 | HTML/CSS temelleri ve React kurulumu (proje iskeleti) |
| 3 | React bileşenleriyle düzen, araç listesi tablosu tasarımı |
| 4 | Araç ekleme ve rezervasyon formunun React bileşeni olarak tasarımı (statik) |
| 5 | JavaScript temelleri (değişken, fonksiyon, dizi, tarih) ve React state yönetimi |
| 6 | **Checkpoint:** React arayüz iskeleti hazır mı? Demo. |

### 🟢 Faz 2 — Backend & Veritabanı (Öncelikli)
| Adım | Hedef |
|-----|-------|
| 7 | Backend kurulumu (Django/Flask/Spring Boot/ASP.NET Core), "Merhaba Dünya" sunucusu |
| 8 | Veritabanı ve `araclar` + `rezervasyonlar` tablolarının oluşturulması |
| 9 | REST API: araç **ekle** ve **listele** uç noktaları |
| 10 | Frontend'i `fetch` ile backend'e bağlama |
| 11 | Araç **sil** ve **güncelle** uç noktaları |
| 12 | Rezervasyon **oluştur** ve **listele** uç noktaları |
| 13 | **Checkpoint:** Uçtan uca araç ve rezervasyon ekle/listele çalışıyor mu? Demo. |

### 🟢 Faz 3 — Çakışma Kontrolü & Müsaitlik (Öncelikli)
| Adım | Hedef |
|-----|-------|
| 14 | **Çakışma kontrolü:** aynı araç aynı tarih aralığında ikinci kez ayrılamaz (backend) |
| 15 | Form doğrulama (bitiş > başlangıç, boş alan, geçmiş tarih) |
| 16 | Rezervasyon iptal + durum yönetimi (Planlandı/Devam/Tamamlandı/İptal) |
| 17 | Müsait araçları listeleme uç noktası (`/api/araclar/musait`) |
| 18 | Rezervasyon liste görünümü ve durum etiketleri |
| 19 | **Checkpoint:** Öncelikli uygulama TAMAM (çakışma engelleniyor). Demo + test. |

### 🔵 Faz 4 — Ek Özellikler (Opsiyonel)
| Adım | Hedef |
|-----|-------|
| — | O1–O6: Filtreleme, arama, sıralama, tema |
| — | O7: Takvim görünümü (aracın dolu günleri) |
| — | O8–O10: Lokasyon, sürücü ataması, km/yakıt kaydı |
| — | O11–O13: Dashboard/rapor, CSV dışa aktarma, bakım kaydı |
| — | O14–O17: Login, onay akışı, rol yönetimi, bildirim |
| — | **Final Sunum:** Tüm proje demosu |

---

## 8. Kilometre Taşları (Milestones)

- ✅ **M1:** React arayüzü (araç listesi + rezervasyon formu) statik olarak hazır. *(Öncelikli)*
- ✅ **M2:** Backend + veritabanı çalışıyor, React arayüzü API'den araç ve rezervasyon eklenip listeleniyor. *(Öncelikli)*
- ✅ **M3:** Uçtan uca CRUD (araç ekle/listele/sil/düzenle + rezervasyon oluştur/iptal) çalışıyor. *(Öncelikli)*
- ✅ **M4:** Çakışma kontrolü, müsaitlik listeleme ve durum yönetimi tamam. **← Ana hedef** *(Öncelikli)*
- ✅ **M5:** Takvim görünümü / rapor / login gibi opsiyoneller eklendi. *(Opsiyonel)*

---

## 9. Çalışma Kuralları ve İpuçları

1. **Küçük gruplar:** 2–3 kişilik takımlar. Takılan yalnız kalmasın.
2. **Günlük hedef:** Her gün net, küçük bir çıktı olsun.
3. **Günlük mini demo:** Gün sonunda 5–10 dakika "bugün ne yaptım" gösterimi.
4. **Git kullanımı:** Her gün en az bir kez commit. Mesaj açıklayıcı olsun.
5. **Önce çalıştır, sonra güzelleştir:** Kod kalitesinden önce çalışan ürün.
6. **Çakışma kontrolünü ihmal etme:** Bu projenin kalbi çakışma kontrolüdür; önce onu doğru çalıştır, sonra süsle.
7. **Önce çalışan bileşen, sonra süsleme:** Frontend'i React ile geliştir; önce bileşenleri sade tut ve çalıştığından emin ol, sonra detayları ekle.
8. **Kopyalamak yerine anlamak:** İnternetten alınan kodun ne yaptığı anlaşılmalı.
9. **Takılınca 20 dakika kuralı:** 20 dakika denedikten sonra sor, saatlerce tıkanma.

---

## 10. Değerlendirme Kriterleri

| Kriter | Ağırlık |
|--------|:-------:|
| Öncelikli özelliklerin çalışması (backend + DB + React arayüz + çakışma kontrolü dahil) | %40 |
| Kod düzeni ve okunabilirliği | %15 |
| Opsiyonel özellikler | %20 |
| Git kullanımı (düzenli commit) | %10 |
| Final sunum ve demo | %15 |

---

## 11. Faydalı Kaynaklar

- **HTML/CSS/JS temelleri:** [MDN Web Docs](https://developer.mozilla.org/tr/) · [W3Schools](https://www.w3schools.com/)
- **React:** [React Resmi Dokümantasyon](https://react.dev/) · [FullCalendar React](https://fullcalendar.io/docs/react)
- **Takvim / grafik kütüphanesi:** [FullCalendar](https://fullcalendar.io/) · [Recharts](https://recharts.org/)
- **JavaScript tarih işlemleri:** [MDN - Date](https://developer.mozilla.org/tr/docs/Web/JavaScript/Reference/Global_Objects/Date)
- **Backend — Python:** [Django](https://www.djangoproject.com/) · [Flask](https://flask.palletsprojects.com/)
- **Backend — Java:** [Spring Boot](https://spring.io/projects/spring-boot)
- **Backend — C#:** [ASP.NET Core](https://learn.microsoft.com/tr-tr/aspnet/core/)
- **Backend — Node.js:** [Express](https://expressjs.com/)
- **Veritabanı:** [SQLite Tutorial](https://www.sqlitetutorial.net/)
- **REST API nedir:** [MDN - HTTP](https://developer.mozilla.org/tr/docs/Web/HTTP)
- **Git öğrenmek:** [Git - Basit Rehber](https://rogerdudler.github.io/git-guide/index.tr.html)

---

> **Son Not:** Bu doküman bir yol haritasıdır, katı bir kural değil. Ekip yavaş ilerliyorsa opsiyonellerin bir kısmı atlanabilir; hızlı ilerliyorsa kendi fikirlerini de ekleyebilir. Önemli olan **staj sonunda backend'i, veritabanı ve arayüzü ile uçtan uca çalışan, aynı aracı çakışan tarihlerde iki kez ayırmayan, gösterilebilir ve gurur duyulabilir bir ürün** çıkarmaktır. Arayüz React ile geliştirilir (zorunlu); önce temel uygulamanın (özellikle çakışma kontrolünün) çalışması gelir, sonra süsleme yapılır.

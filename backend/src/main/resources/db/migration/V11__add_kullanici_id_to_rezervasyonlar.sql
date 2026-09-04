ALTER TABLE rezervasyonlar ADD COLUMN kullanici_id BIGINT REFERENCES kullanicilar(id);

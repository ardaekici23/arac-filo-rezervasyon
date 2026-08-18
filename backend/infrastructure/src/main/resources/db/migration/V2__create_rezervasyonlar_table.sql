CREATE TABLE rezervasyonlar (
    id BIGSERIAL PRIMARY KEY,
    arac_id BIGINT NOT NULL REFERENCES araclar(id),
    kullanici_adi VARCHAR(100) NOT NULL,
    baslangic_tarihi DATE NOT NULL,
    bitis_tarihi DATE NOT NULL,
    amac VARCHAR(255),
    durum VARCHAR(20) NOT NULL,
    olusturma_tarihi TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_rezervasyonlar_arac_id ON rezervasyonlar(arac_id);

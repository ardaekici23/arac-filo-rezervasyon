package com.aracfilo.infrastructure.reservation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rezervasyonlar")
public class ReservationJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "arac_id", nullable = false)
    private Long aracId;

    @Column(name = "kullanici_adi", nullable = false)
    private String kullaniciAdi;

    @Column(name = "baslangic_tarihi", nullable = false)
    private LocalDate baslangicTarihi;

    @Column(name = "bitis_tarihi", nullable = false)
    private LocalDate bitisTarihi;

    @Column(name = "amac")
    private String amac;

    @Column(name = "durum", nullable = false)
    private String durum;

    @Column(name = "olusturma_tarihi", nullable = false)
    private LocalDateTime olusturmaTarihi;

    protected ReservationJpaEntity() {
        // JPA
    }

    public ReservationJpaEntity(Long id, Long aracId, String kullaniciAdi, LocalDate baslangicTarihi,
                                 LocalDate bitisTarihi, String amac, String durum, LocalDateTime olusturmaTarihi) {
        this.id = id;
        this.aracId = aracId;
        this.kullaniciAdi = kullaniciAdi;
        this.baslangicTarihi = baslangicTarihi;
        this.bitisTarihi = bitisTarihi;
        this.amac = amac;
        this.durum = durum;
        this.olusturmaTarihi = olusturmaTarihi;
    }

    public Long getId() {
        return id;
    }

    public Long getAracId() {
        return aracId;
    }

    public String getKullaniciAdi() {
        return kullaniciAdi;
    }

    public LocalDate getBaslangicTarihi() {
        return baslangicTarihi;
    }

    public LocalDate getBitisTarihi() {
        return bitisTarihi;
    }

    public String getAmac() {
        return amac;
    }

    public String getDurum() {
        return durum;
    }

    public LocalDateTime getOlusturmaTarihi() {
        return olusturmaTarihi;
    }
}

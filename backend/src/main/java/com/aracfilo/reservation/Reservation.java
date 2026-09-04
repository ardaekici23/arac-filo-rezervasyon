package com.aracfilo.reservation;

import com.aracfilo.common.BusinessRuleException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rezervasyonlar")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "arac_id", nullable = false)
    private Long aracId;

    @Column(name = "kullanici_adi", nullable = false)
    private String kullaniciAdi;

    @Column(name = "kullanici_id")
    private Long kullaniciId;

    @Column(name = "baslangic_tarihi", nullable = false)
    private LocalDate baslangicTarihi;

    @Column(name = "bitis_tarihi", nullable = false)
    private LocalDate bitisTarihi;

    @Column(name = "amac")
    private String amac;

    @Enumerated(EnumType.STRING)
    @Column(name = "durum", nullable = false)
    private ReservationStatus durum;

    @Column(name = "olusturma_tarihi", nullable = false)
    private LocalDateTime olusturmaTarihi;

    protected Reservation() {
        // JPA
    }

    public Reservation(Long aracId, String kullaniciAdi, Long kullaniciId, LocalDate baslangicTarihi, LocalDate bitisTarihi,
                        String amac, ReservationStatus durum, LocalDateTime olusturmaTarihi) {
        if (!bitisTarihi.isAfter(baslangicTarihi)) {
            throw new BusinessRuleException("Bitiş tarihi başlangıç tarihinden sonra olmalıdır");
        }
        this.aracId = aracId;
        this.kullaniciAdi = kullaniciAdi;
        this.kullaniciId = kullaniciId;
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

    public Long getKullaniciId() {
        return kullaniciId;
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

    public ReservationStatus getDurum() {
        return durum;
    }

    public LocalDateTime getOlusturmaTarihi() {
        return olusturmaTarihi;
    }

    public void setDurum(ReservationStatus durum) {
        this.durum = durum;
    }
}

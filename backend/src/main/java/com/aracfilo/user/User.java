package com.aracfilo.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "kullanicilar")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ad", nullable = false)
    private String ad;

    @Column(name = "eposta", nullable = false, unique = true)
    private String eposta;

    @Column(name = "sifre_hash", nullable = false)
    private String sifreHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private UserRole rol;

    @Column(name = "olusturma_tarihi", nullable = false)
    private LocalDateTime olusturmaTarihi;

    protected User() {
        // JPA
    }

    public User(String ad, String eposta, String sifreHash, UserRole rol, LocalDateTime olusturmaTarihi) {
        this.ad = ad;
        this.eposta = eposta;
        this.sifreHash = sifreHash;
        this.rol = rol;
        this.olusturmaTarihi = olusturmaTarihi;
    }

    public Long getId() {
        return id;
    }

    public String getAd() {
        return ad;
    }

    public void setAd(String ad) {
        this.ad = ad;
    }

    public String getEposta() {
        return eposta;
    }

    public void setEposta(String eposta) {
        this.eposta = eposta;
    }

    public String getSifreHash() {
        return sifreHash;
    }

    public UserRole getRol() {
        return rol;
    }

    public void setRol(UserRole rol) {
        this.rol = rol;
    }

    public LocalDateTime getOlusturmaTarihi() {
        return olusturmaTarihi;
    }
}

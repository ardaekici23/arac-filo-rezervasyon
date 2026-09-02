package com.aracfilo.vehicle;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "araclar")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plaka", nullable = false, unique = true)
    private String plaka;

    @Column(name = "marka_model", nullable = false)
    private String markaModel;

    @Enumerated(EnumType.STRING)
    @Column(name = "tur", nullable = false)
    private VehicleType tur;

    @Enumerated(EnumType.STRING)
    @Column(name = "durum", nullable = false)
    private VehicleStatus durum;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "yil")
    private Integer yil;

    @Enumerated(EnumType.STRING)
    @Column(name = "kategori")
    private VehicleCategory kategori;

    @Column(name = "koltuk")
    private Integer koltuk;

    @Enumerated(EnumType.STRING)
    @Column(name = "yakit")
    private FuelType yakit;

    @Enumerated(EnumType.STRING)
    @Column(name = "vites")
    private Gearbox vites;

    @Column(name = "km")
    private Integer km;

    @Column(name = "sehir_tuketim")
    private Double sehirTuketim;

    @Column(name = "yol_tuketim")
    private Double yolTuketim;

    @Column(name = "menzil")
    private Integer menzil;

    @Column(name = "kwh")
    private Double kwh;

    protected Vehicle() {
        // JPA
    }

    public Vehicle(String plaka, String markaModel, VehicleType tur, VehicleStatus durum, String fotoUrl, Integer yil,
            VehicleCategory kategori, Integer koltuk, FuelType yakit, Gearbox vites, Integer km,
            Double sehirTuketim, Double yolTuketim, Integer menzil, Double kwh) {
        this.plaka = plaka;
        this.markaModel = markaModel;
        this.tur = tur;
        this.durum = durum;
        this.fotoUrl = fotoUrl;
        this.yil = yil;
        this.kategori = kategori;
        this.koltuk = koltuk;
        this.yakit = yakit;
        this.vites = vites;
        this.km = km;
        this.sehirTuketim = sehirTuketim;
        this.yolTuketim = yolTuketim;
        this.menzil = menzil;
        this.kwh = kwh;
    }

    public Long getId() {
        return id;
    }

    public String getPlaka() {
        return plaka;
    }

    public void setPlaka(String plaka) {
        this.plaka = plaka;
    }

    public String getMarkaModel() {
        return markaModel;
    }

    public void setMarkaModel(String markaModel) {
        this.markaModel = markaModel;
    }

    public VehicleType getTur() {
        return tur;
    }

    public void setTur(VehicleType tur) {
        this.tur = tur;
    }

    public VehicleStatus getDurum() {
        return durum;
    }

    public void setDurum(VehicleStatus durum) {
        this.durum = durum;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public Integer getYil() {
        return yil;
    }

    public void setYil(Integer yil) {
        this.yil = yil;
    }

    public VehicleCategory getKategori() {
        return kategori;
    }

    public void setKategori(VehicleCategory kategori) {
        this.kategori = kategori;
    }

    public Integer getKoltuk() {
        return koltuk;
    }

    public void setKoltuk(Integer koltuk) {
        this.koltuk = koltuk;
    }

    public FuelType getYakit() {
        return yakit;
    }

    public void setYakit(FuelType yakit) {
        this.yakit = yakit;
    }

    public Gearbox getVites() {
        return vites;
    }

    public void setVites(Gearbox vites) {
        this.vites = vites;
    }

    public Integer getKm() {
        return km;
    }

    public void setKm(Integer km) {
        this.km = km;
    }

    public Double getSehirTuketim() {
        return sehirTuketim;
    }

    public void setSehirTuketim(Double sehirTuketim) {
        this.sehirTuketim = sehirTuketim;
    }

    public Double getYolTuketim() {
        return yolTuketim;
    }

    public void setYolTuketim(Double yolTuketim) {
        this.yolTuketim = yolTuketim;
    }

    public Integer getMenzil() {
        return menzil;
    }

    public void setMenzil(Integer menzil) {
        this.menzil = menzil;
    }

    public Double getKwh() {
        return kwh;
    }

    public void setKwh(Double kwh) {
        this.kwh = kwh;
    }
}

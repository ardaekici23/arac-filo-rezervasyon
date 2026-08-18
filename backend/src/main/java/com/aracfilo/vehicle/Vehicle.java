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

    protected Vehicle() {
        // JPA
    }

    public Vehicle(String plaka, String markaModel, VehicleType tur, VehicleStatus durum) {
        this.plaka = plaka;
        this.markaModel = markaModel;
        this.tur = tur;
        this.durum = durum;
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
}

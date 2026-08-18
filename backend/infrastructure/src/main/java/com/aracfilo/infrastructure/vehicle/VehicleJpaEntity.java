package com.aracfilo.infrastructure.vehicle;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "araclar")
public class VehicleJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plaka", nullable = false, unique = true)
    private String plaka;

    @Column(name = "marka_model", nullable = false)
    private String markaModel;

    @Column(name = "tur", nullable = false)
    private String tur;

    @Column(name = "durum", nullable = false)
    private String durum;

    protected VehicleJpaEntity() {
        // JPA
    }

    public VehicleJpaEntity(Long id, String plaka, String markaModel, String tur, String durum) {
        this.id = id;
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

    public String getMarkaModel() {
        return markaModel;
    }

    public String getTur() {
        return tur;
    }

    public String getDurum() {
        return durum;
    }
}

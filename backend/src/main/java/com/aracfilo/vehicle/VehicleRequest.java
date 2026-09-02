package com.aracfilo.vehicle;

import jakarta.validation.constraints.NotBlank;

public record VehicleRequest(
        @NotBlank String plaka,
        @NotBlank String markaModel,
        @NotBlank String tur,
        @NotBlank String durum,
        String fotoUrl,
        Integer yil,
        String kategori,
        Integer koltuk,
        String yakit,
        String vites,
        Integer km,
        Double sehirTuketim,
        Double yolTuketim,
        Integer menzil,
        Double kwh) {
}

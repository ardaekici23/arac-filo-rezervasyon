package com.aracfilo.vehicle;

public record VehicleResponse(
        Long id,
        String plaka,
        String markaModel,
        String tur,
        String durum,
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

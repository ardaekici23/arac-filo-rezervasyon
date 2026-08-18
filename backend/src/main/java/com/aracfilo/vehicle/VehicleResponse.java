package com.aracfilo.vehicle;

public record VehicleResponse(
        Long id,
        String plaka,
        String markaModel,
        String tur,
        String durum) {
}

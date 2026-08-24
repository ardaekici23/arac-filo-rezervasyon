package com.aracfilo.vehicle;

import jakarta.validation.constraints.NotBlank;

public record VehicleRequest(
        @NotBlank String plaka,
        @NotBlank String markaModel,
        @NotBlank String tur,
        @NotBlank String durum,
        String fotoUrl) {
}

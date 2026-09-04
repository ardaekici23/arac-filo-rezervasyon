package com.aracfilo.reservation;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ReservationRequest(
        @NotNull Long aracId,
        @NotBlank String kullaniciAdi,
        @NotNull Long kullaniciId,
        @NotNull @FutureOrPresent LocalDate baslangicTarihi,
        @NotNull LocalDate bitisTarihi,
        String amac) {
}

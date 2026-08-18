package com.aracfilo.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservationResponse(
        Long id,
        Long aracId,
        String kullaniciAdi,
        LocalDate baslangicTarihi,
        LocalDate bitisTarihi,
        String amac,
        String durum,
        LocalDateTime olusturmaTarihi) {
}

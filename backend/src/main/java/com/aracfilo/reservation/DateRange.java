package com.aracfilo.reservation;

import java.time.LocalDate;

/**
 * Çakışma kontrolü için yardımcı sınıf (henüz servis katmanında kullanılmıyor).
 * Kural: A1 <= B2 VE B1 <= A2 (proje dokümanı m.5)
 */
public record DateRange(LocalDate baslangicTarihi, LocalDate bitisTarihi) {

    public boolean overlaps(DateRange other) {
        return !this.baslangicTarihi.isAfter(other.bitisTarihi)
                && !other.baslangicTarihi.isAfter(this.bitisTarihi);
    }
}

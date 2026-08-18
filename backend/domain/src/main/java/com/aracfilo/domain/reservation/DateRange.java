package com.aracfilo.domain.reservation;

import com.aracfilo.domain.shared.DomainException;
import java.time.LocalDate;

public record DateRange(LocalDate baslangicTarihi, LocalDate bitisTarihi) {

    public DateRange {
        if (baslangicTarihi == null || bitisTarihi == null) {
            throw new DomainException("Başlangıç ve bitiş tarihi zorunludur");
        }
        if (!bitisTarihi.isAfter(baslangicTarihi)) {
            throw new DomainException("Bitiş tarihi başlangıç tarihinden sonra olmalıdır");
        }
    }

    /** Çakışma kuralı: A1 <= B2 VE B1 <= A2 (proje dokümanı m.5) */
    public boolean overlaps(DateRange other) {
        return !this.baslangicTarihi.isAfter(other.bitisTarihi)
                && !other.baslangicTarihi.isAfter(this.bitisTarihi);
    }
}

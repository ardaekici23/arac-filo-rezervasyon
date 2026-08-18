package com.aracfilo.domain.reservation;

import java.time.LocalDateTime;

public class Reservation {

    private final Long id;
    private final Long aracId;
    private final String kullaniciAdi;
    private final DateRange dateRange;
    private final String amac;
    private final ReservationStatus status;
    private final LocalDateTime olusturmaTarihi;

    public Reservation(Long id, Long aracId, String kullaniciAdi, DateRange dateRange,
                        String amac, ReservationStatus status, LocalDateTime olusturmaTarihi) {
        this.id = id;
        this.aracId = aracId;
        this.kullaniciAdi = kullaniciAdi;
        this.dateRange = dateRange;
        this.amac = amac;
        this.status = status;
        this.olusturmaTarihi = olusturmaTarihi;
    }

    public Long getId() {
        return id;
    }

    public Long getAracId() {
        return aracId;
    }

    public String getKullaniciAdi() {
        return kullaniciAdi;
    }

    public DateRange getDateRange() {
        return dateRange;
    }

    public String getAmac() {
        return amac;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public LocalDateTime getOlusturmaTarihi() {
        return olusturmaTarihi;
    }
}

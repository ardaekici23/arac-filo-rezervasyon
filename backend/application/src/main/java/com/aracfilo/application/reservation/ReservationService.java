package com.aracfilo.application.reservation;

import com.aracfilo.domain.reservation.Reservation;
import java.util.List;
import java.util.Optional;

public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<Reservation> listAll() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> findById(Long id) {
        return reservationRepository.findById(id);
    }

    // TODO: kayıt öncesi findActiveByVehicleId + DateRange.overlaps ile çakışma kontrolü eklenecek (sonraki session)
    public Reservation create(Reservation reservation) {
        return reservationRepository.save(reservation);
    }
}

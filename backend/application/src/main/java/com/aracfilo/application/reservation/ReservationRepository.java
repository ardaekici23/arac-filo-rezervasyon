package com.aracfilo.application.reservation;

import com.aracfilo.domain.reservation.Reservation;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository {

    List<Reservation> findAll();

    Optional<Reservation> findById(Long id);

    List<Reservation> findActiveByVehicleId(Long aracId);

    Reservation save(Reservation reservation);
}

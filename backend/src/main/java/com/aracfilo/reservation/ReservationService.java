package com.aracfilo.reservation;

import com.aracfilo.common.NotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<Reservation> listAll() {
        return reservationRepository.findAll();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rezervasyon bulunamadı: " + id));
    }

    // TODO: kayıt öncesi findByAracIdAndDurumNot + DateRange.overlaps ile çakışma kontrolü eklenecek (sonraki session)
    public Reservation create(Reservation reservation) {
        return reservationRepository.save(reservation);
    }
}

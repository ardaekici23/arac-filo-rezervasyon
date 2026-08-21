package com.aracfilo.reservation;

import com.aracfilo.common.BusinessRuleException;
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

    public Reservation create(Reservation reservation) {
        DateRange yeniAralik = new DateRange(reservation.getBaslangicTarihi(), reservation.getBitisTarihi());
        List<Reservation> digerRezervasyonlar =
                reservationRepository.findByAracIdAndDurumNot(reservation.getAracId(), ReservationStatus.IPTAL);

        boolean cakisiyor = digerRezervasyonlar.stream()
                .map(r -> new DateRange(r.getBaslangicTarihi(), r.getBitisTarihi()))
                .anyMatch(yeniAralik::overlaps);

        if (cakisiyor) {
            throw new BusinessRuleException("Bu araç seçilen tarih aralığında zaten rezerve edilmiş");
        }

        return reservationRepository.save(reservation);
    }
}

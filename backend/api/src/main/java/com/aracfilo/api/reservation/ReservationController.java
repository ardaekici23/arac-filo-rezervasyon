package com.aracfilo.api.reservation;

import com.aracfilo.application.reservation.ReservationService;
import com.aracfilo.domain.reservation.DateRange;
import com.aracfilo.domain.reservation.Reservation;
import com.aracfilo.domain.reservation.ReservationStatus;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rezervasyonlar")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<ReservationResponse> list() {
        return reservationService.listAll().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getById(@PathVariable Long id) {
        return reservationService.findById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> create(@Valid @RequestBody ReservationRequest request) {
        Reservation reservation = new Reservation(
                null,
                request.aracId(),
                request.kullaniciAdi(),
                new DateRange(request.baslangicTarihi(), request.bitisTarihi()),
                request.amac(),
                ReservationStatus.PLANLANDI,
                LocalDateTime.now());
        Reservation saved = reservationService.create(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    private ReservationResponse toResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getAracId(),
                reservation.getKullaniciAdi(),
                reservation.getDateRange().baslangicTarihi(),
                reservation.getDateRange().bitisTarihi(),
                reservation.getAmac(),
                reservation.getStatus().name(),
                reservation.getOlusturmaTarihi());
    }
}

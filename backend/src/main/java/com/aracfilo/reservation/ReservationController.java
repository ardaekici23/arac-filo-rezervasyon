package com.aracfilo.reservation;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
    public ReservationResponse getById(@PathVariable Long id) {
        return toResponse(reservationService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> create(@Valid @RequestBody ReservationRequest request) {
        Reservation reservation = new Reservation(
                request.aracId(),
                request.kullaniciAdi(),
                request.baslangicTarihi(),
                request.bitisTarihi(),
                request.amac(),
                ReservationStatus.BEKLEMEDE,
                LocalDateTime.now());
        Reservation saved = reservationService.create(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PatchMapping("/{id}/durum")
    public ReservationResponse updateStatus(@PathVariable Long id, @Valid @RequestBody ReservationStatusRequest request) {
        return toResponse(reservationService.updateStatus(id, request.durum()));
    }

    private ReservationResponse toResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getAracId(),
                reservation.getKullaniciAdi(),
                reservation.getBaslangicTarihi(),
                reservation.getBitisTarihi(),
                reservation.getAmac(),
                reservation.getDurum().name(),
                reservation.getOlusturmaTarihi());
    }
}

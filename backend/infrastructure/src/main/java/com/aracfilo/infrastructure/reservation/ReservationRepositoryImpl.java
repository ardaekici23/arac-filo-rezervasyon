package com.aracfilo.infrastructure.reservation;

import com.aracfilo.application.reservation.ReservationRepository;
import com.aracfilo.domain.reservation.DateRange;
import com.aracfilo.domain.reservation.Reservation;
import com.aracfilo.domain.reservation.ReservationStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class ReservationRepositoryImpl implements ReservationRepository {

    private final ReservationJpaRepository jpaRepository;

    public ReservationRepositoryImpl(ReservationJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Reservation> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Reservation> findById(Long id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Reservation> findActiveByVehicleId(Long aracId) {
        return jpaRepository.findByAracIdAndDurumNot(aracId, ReservationStatus.IPTAL.name())
                .stream().map(this::toDomain).toList();
    }

    @Override
    public Reservation save(Reservation reservation) {
        ReservationJpaEntity entity = new ReservationJpaEntity(
                reservation.getId(),
                reservation.getAracId(),
                reservation.getKullaniciAdi(),
                reservation.getDateRange().baslangicTarihi(),
                reservation.getDateRange().bitisTarihi(),
                reservation.getAmac(),
                reservation.getStatus().name(),
                reservation.getOlusturmaTarihi());
        return toDomain(jpaRepository.save(entity));
    }

    private Reservation toDomain(ReservationJpaEntity entity) {
        return new Reservation(
                entity.getId(),
                entity.getAracId(),
                entity.getKullaniciAdi(),
                new DateRange(entity.getBaslangicTarihi(), entity.getBitisTarihi()),
                entity.getAmac(),
                ReservationStatus.valueOf(entity.getDurum()),
                entity.getOlusturmaTarihi());
    }
}

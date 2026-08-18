package com.aracfilo.infrastructure.reservation;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationJpaRepository extends JpaRepository<ReservationJpaEntity, Long> {

    List<ReservationJpaEntity> findByAracIdAndDurumNot(Long aracId, String durum);
}

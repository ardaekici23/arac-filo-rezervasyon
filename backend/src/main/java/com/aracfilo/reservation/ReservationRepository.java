package com.aracfilo.reservation;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByAracIdAndDurumNot(Long aracId, ReservationStatus durum);

    List<Reservation> findByKullaniciIdAndDurumNot(Long kullaniciId, ReservationStatus durum);

    @Query("""
            SELECT DISTINCT r.aracId FROM Reservation r
            WHERE r.durum <> :haricDurum
            AND r.baslangicTarihi <= :bitis
            AND r.bitisTarihi >= :baslangic
            """)
    List<Long> findCakisanAracIdler(@Param("baslangic") LocalDate baslangic,
                                     @Param("bitis") LocalDate bitis,
                                     @Param("haricDurum") ReservationStatus haricDurum);
}

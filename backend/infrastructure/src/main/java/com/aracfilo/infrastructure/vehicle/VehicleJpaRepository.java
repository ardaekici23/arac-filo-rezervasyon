package com.aracfilo.infrastructure.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleJpaRepository extends JpaRepository<VehicleJpaEntity, Long> {
}

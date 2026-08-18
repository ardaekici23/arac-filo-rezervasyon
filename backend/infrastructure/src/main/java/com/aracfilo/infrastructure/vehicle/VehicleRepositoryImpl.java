package com.aracfilo.infrastructure.vehicle;

import com.aracfilo.application.vehicle.VehicleRepository;
import com.aracfilo.domain.vehicle.Vehicle;
import com.aracfilo.domain.vehicle.VehiclePlate;
import com.aracfilo.domain.vehicle.VehicleStatus;
import com.aracfilo.domain.vehicle.VehicleType;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class VehicleRepositoryImpl implements VehicleRepository {

    private final VehicleJpaRepository jpaRepository;

    public VehicleRepositoryImpl(VehicleJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Vehicle> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Vehicle> findById(Long id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Vehicle save(Vehicle vehicle) {
        VehicleJpaEntity entity = new VehicleJpaEntity(
                vehicle.getId(),
                vehicle.getPlate().value(),
                vehicle.getMarkaModel(),
                vehicle.getType().name(),
                vehicle.getStatus().name());
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    private Vehicle toDomain(VehicleJpaEntity entity) {
        return new Vehicle(
                entity.getId(),
                new VehiclePlate(entity.getPlaka()),
                entity.getMarkaModel(),
                VehicleType.valueOf(entity.getTur()),
                VehicleStatus.valueOf(entity.getDurum()));
    }
}

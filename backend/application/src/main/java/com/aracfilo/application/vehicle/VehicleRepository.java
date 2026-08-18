package com.aracfilo.application.vehicle;

import com.aracfilo.domain.vehicle.Vehicle;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository {

    List<Vehicle> findAll();

    Optional<Vehicle> findById(Long id);

    Vehicle save(Vehicle vehicle);

    void deleteById(Long id);
}

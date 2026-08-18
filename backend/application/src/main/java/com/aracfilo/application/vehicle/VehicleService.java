package com.aracfilo.application.vehicle;

import com.aracfilo.domain.vehicle.Vehicle;
import java.util.List;
import java.util.Optional;

public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> listAll() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> findById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }
}

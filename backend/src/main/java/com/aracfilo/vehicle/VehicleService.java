package com.aracfilo.vehicle;

import com.aracfilo.common.NotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> listAll() {
        return vehicleRepository.findAll();
    }

    public Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Araç bulunamadı: " + id));
    }

    public Vehicle create(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(Long id, Vehicle changes) {
        Vehicle existing = findById(id);
        existing.setPlaka(changes.getPlaka());
        existing.setMarkaModel(changes.getMarkaModel());
        existing.setTur(changes.getTur());
        existing.setDurum(changes.getDurum());
        return vehicleRepository.save(existing);
    }

    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }
}

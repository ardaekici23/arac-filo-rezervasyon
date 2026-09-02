package com.aracfilo.vehicle;

import com.aracfilo.common.NotFoundException;
import com.aracfilo.reservation.ReservationRepository;
import com.aracfilo.reservation.ReservationStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ReservationRepository reservationRepository;

    public VehicleService(VehicleRepository vehicleRepository, ReservationRepository reservationRepository) {
        this.vehicleRepository = vehicleRepository;
        this.reservationRepository = reservationRepository;
    }

    public List<Vehicle> listAll() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> listMusait(LocalDate baslangic, LocalDate bitis) {
        List<Long> doluAracIdler = reservationRepository.findCakisanAracIdler(baslangic, bitis, ReservationStatus.IPTAL);
        return vehicleRepository.findAll().stream()
                .filter(vehicle -> vehicle.getDurum() == VehicleStatus.MUSAIT)
                .filter(vehicle -> !doluAracIdler.contains(vehicle.getId()))
                .toList();
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
        existing.setFotoUrl(changes.getFotoUrl());
        existing.setYil(changes.getYil());
        existing.setKategori(changes.getKategori());
        existing.setKoltuk(changes.getKoltuk());
        existing.setYakit(changes.getYakit());
        existing.setVites(changes.getVites());
        existing.setKm(changes.getKm());
        existing.setSehirTuketim(changes.getSehirTuketim());
        existing.setYolTuketim(changes.getYolTuketim());
        existing.setMenzil(changes.getMenzil());
        existing.setKwh(changes.getKwh());
        return vehicleRepository.save(existing);
    }

    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }
}

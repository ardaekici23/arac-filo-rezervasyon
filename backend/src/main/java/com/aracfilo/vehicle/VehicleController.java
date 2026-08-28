package com.aracfilo.vehicle;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/araclar")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public List<VehicleResponse> list() {
        return vehicleService.listAll().stream().map(this::toResponse).toList();
    }

    @GetMapping("/musait")
    public List<VehicleResponse> musait(@RequestParam LocalDate baslangic, @RequestParam LocalDate bitis) {
        return vehicleService.listMusait(baslangic, bitis).stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable Long id) {
        return toResponse(vehicleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
        Vehicle saved = vehicleService.create(toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return toResponse(vehicleService.update(id, toEntity(request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Vehicle toEntity(VehicleRequest request) {
        return new Vehicle(
                request.plaka(),
                request.markaModel(),
                VehicleType.valueOf(request.tur()),
                VehicleStatus.valueOf(request.durum()),
                request.fotoUrl(),
                request.yil());
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getPlaka(),
                vehicle.getMarkaModel(),
                vehicle.getTur().name(),
                vehicle.getDurum().name(),
                vehicle.getFotoUrl(),
                vehicle.getYil());
    }
}

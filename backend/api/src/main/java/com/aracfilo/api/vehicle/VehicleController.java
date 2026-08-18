package com.aracfilo.api.vehicle;

import com.aracfilo.application.vehicle.VehicleService;
import com.aracfilo.domain.vehicle.Vehicle;
import com.aracfilo.domain.vehicle.VehiclePlate;
import com.aracfilo.domain.vehicle.VehicleStatus;
import com.aracfilo.domain.vehicle.VehicleType;
import jakarta.validation.Valid;
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

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getById(@PathVariable Long id) {
        return vehicleService.findById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
        Vehicle saved = vehicleService.save(toDomain(null, request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return toResponse(vehicleService.save(toDomain(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Vehicle toDomain(Long id, VehicleRequest request) {
        return new Vehicle(
                id,
                new VehiclePlate(request.plaka()),
                request.markaModel(),
                VehicleType.valueOf(request.tur()),
                VehicleStatus.valueOf(request.durum()));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getPlate().value(),
                vehicle.getMarkaModel(),
                vehicle.getType().name(),
                vehicle.getStatus().name());
    }
}

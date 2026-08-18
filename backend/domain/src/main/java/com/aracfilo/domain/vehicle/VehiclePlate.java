package com.aracfilo.domain.vehicle;

import com.aracfilo.domain.shared.DomainException;

public record VehiclePlate(String value) {

    public VehiclePlate {
        if (value == null || value.isBlank()) {
            throw new DomainException("Plaka boş olamaz");
        }
    }
}

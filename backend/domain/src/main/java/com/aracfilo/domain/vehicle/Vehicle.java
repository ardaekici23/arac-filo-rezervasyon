package com.aracfilo.domain.vehicle;

public class Vehicle {

    private final Long id;
    private final VehiclePlate plate;
    private final String markaModel;
    private final VehicleType type;
    private final VehicleStatus status;

    public Vehicle(Long id, VehiclePlate plate, String markaModel, VehicleType type, VehicleStatus status) {
        this.id = id;
        this.plate = plate;
        this.markaModel = markaModel;
        this.type = type;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public VehiclePlate getPlate() {
        return plate;
    }

    public String getMarkaModel() {
        return markaModel;
    }

    public VehicleType getType() {
        return type;
    }

    public VehicleStatus getStatus() {
        return status;
    }
}

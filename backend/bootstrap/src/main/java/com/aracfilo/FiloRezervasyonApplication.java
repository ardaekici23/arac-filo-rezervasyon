package com.aracfilo;

import com.aracfilo.application.reservation.ReservationRepository;
import com.aracfilo.application.reservation.ReservationService;
import com.aracfilo.application.vehicle.VehicleRepository;
import com.aracfilo.application.vehicle.VehicleService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FiloRezervasyonApplication {

    public static void main(String[] args) {
        SpringApplication.run(FiloRezervasyonApplication.class, args);
    }

    // application modülü Spring'e bağımlı olmadığı için servisler burada,
    // infrastructure'ın sağladığı repository implementasyonlarıyla wire edilir.

    @Bean
    public VehicleService vehicleService(VehicleRepository vehicleRepository) {
        return new VehicleService(vehicleRepository);
    }

    @Bean
    public ReservationService reservationService(ReservationRepository reservationRepository) {
        return new ReservationService(reservationRepository);
    }
}

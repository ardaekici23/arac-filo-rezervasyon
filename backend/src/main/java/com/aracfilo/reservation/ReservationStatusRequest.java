package com.aracfilo.reservation;

import jakarta.validation.constraints.NotNull;

public record ReservationStatusRequest(@NotNull ReservationStatus durum) {
}

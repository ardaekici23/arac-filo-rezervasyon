package com.aracfilo.api.shared;

import java.time.LocalDateTime;

public record ApiErrorResponse(LocalDateTime timestamp, int status, String message) {
}

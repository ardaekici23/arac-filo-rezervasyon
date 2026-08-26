package com.aracfilo.user;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String eposta,
        @NotBlank String sifre) {
}

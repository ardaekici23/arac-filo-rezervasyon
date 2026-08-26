package com.aracfilo.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String ad,
        @NotBlank @Email String eposta,
        @NotBlank @Size(min = 6) String sifre,
        @NotBlank String rol) {
}

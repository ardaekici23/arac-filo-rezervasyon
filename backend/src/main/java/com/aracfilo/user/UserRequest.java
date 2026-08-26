package com.aracfilo.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public record UserRequest(
        @NotBlank String ad,
        @NotBlank @Email String eposta,
        @NotBlank String rol) {
}

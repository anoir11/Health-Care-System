package com.medilink.healthcaresystem.service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyEmailRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String code;
}

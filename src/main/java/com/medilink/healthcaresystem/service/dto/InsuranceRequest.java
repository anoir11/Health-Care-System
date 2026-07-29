package com.medilink.healthcaresystem.service.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InsuranceRequest {

    @NotBlank
    private String provider;

    @NotBlank
    private String policyNumber;

    private LocalDate expiryDate;

    private String coverage;

    private boolean active = true;
}

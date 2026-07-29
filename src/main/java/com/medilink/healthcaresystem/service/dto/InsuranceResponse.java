package com.medilink.healthcaresystem.service.dto;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InsuranceResponse {

    private String provider;
    private String policyNumber;
    private LocalDate expiryDate;
    private String coverage;
    private boolean active;
}

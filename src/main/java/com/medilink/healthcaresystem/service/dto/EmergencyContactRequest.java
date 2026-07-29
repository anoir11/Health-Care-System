package com.medilink.healthcaresystem.service.dto;

import com.medilink.healthcaresystem.domain.enums.ContactRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmergencyContactRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String relationship;

    @NotBlank
    private String phone;

    @NotNull
    private ContactRole role;
}

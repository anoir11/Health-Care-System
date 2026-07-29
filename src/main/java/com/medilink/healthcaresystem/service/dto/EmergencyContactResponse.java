package com.medilink.healthcaresystem.service.dto;

import com.medilink.healthcaresystem.domain.enums.ContactRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmergencyContactResponse {

    private Long id;
    private String name;
    private String relationship;
    private String phone;
    private ContactRole role;
}

package com.medilink.healthcaresystem.service.dto;

import com.medilink.healthcaresystem.domain.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Role role;
}

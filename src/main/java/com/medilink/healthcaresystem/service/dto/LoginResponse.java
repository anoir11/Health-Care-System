package com.medilink.healthcaresystem.service.dto;

import com.medilink.healthcaresystem.domain.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String token;
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
}

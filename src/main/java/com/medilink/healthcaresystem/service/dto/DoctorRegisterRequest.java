package com.medilink.healthcaresystem.service.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class DoctorRegisterRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    @Size(min = 8)
    private String password;

    @NotBlank
    private String specialty;

    @NotBlank
    private String licenseNumber;

    @NotBlank
    private String cinNumber;

    private String clinicName;

    @NotNull
    private Integer yearsExperience;

    // Required documents
    @NotNull
    private MultipartFile cinDocument;

    @NotNull
    private MultipartFile diplomaDocument;

    @NotNull
    private MultipartFile cvDocument;

    // Optional
    private MultipartFile licenseDocument;
}

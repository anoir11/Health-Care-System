package com.medilink.healthcaresystem.web.rest;

import com.medilink.healthcaresystem.service.DoctorService;
import com.medilink.healthcaresystem.service.PatientService;
import com.medilink.healthcaresystem.service.dto.DoctorRegisterRequest;
import com.medilink.healthcaresystem.service.dto.PatientRegisterRequest;
import com.medilink.healthcaresystem.service.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PatientService patientService;
    private final DoctorService doctorService;

    @PostMapping("/register/patient")
    public ResponseEntity<UserResponse> registerPatient(@Valid @RequestBody PatientRegisterRequest request) {
        UserResponse response = patientService.patientRegister(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(value = "/register/doctor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> registerDoctor(@Valid @ModelAttribute DoctorRegisterRequest request) {
        UserResponse response = doctorService.doctorRegister(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

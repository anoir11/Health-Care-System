package com.medilink.healthcaresystem.web.rest;

import com.medilink.healthcaresystem.domain.User;
import com.medilink.healthcaresystem.repository.UserRepository;
import com.medilink.healthcaresystem.service.AuthenticationService;
import com.medilink.healthcaresystem.service.DoctorService;
import com.medilink.healthcaresystem.service.PatientService;
import com.medilink.healthcaresystem.service.VerificationService;
import com.medilink.healthcaresystem.service.dto.DoctorRegisterRequest;
import com.medilink.healthcaresystem.service.dto.LoginRequest;
import com.medilink.healthcaresystem.service.dto.LoginResponse;
import com.medilink.healthcaresystem.service.dto.PatientRegisterRequest;
import com.medilink.healthcaresystem.service.dto.ResendCodeRequest;
import com.medilink.healthcaresystem.service.dto.UserResponse;
import com.medilink.healthcaresystem.service.dto.VerifyEmailRequest;
import jakarta.validation.Valid;
import java.util.Map;
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
    private final VerificationService verificationService;
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

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

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        boolean valid = verificationService.verifyCode(request.getEmail(), request.getCode());

        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired code"));
        }

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @PostMapping("/resend-code")
    public ResponseEntity<Map<String, String>> resendCode(@Valid @RequestBody ResendCodeRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email not found"));
        }
        verificationService.generateAndSendCode(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Verification code resent"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }
}

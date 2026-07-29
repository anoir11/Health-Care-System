package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.Authority;
import com.medilink.healthcaresystem.domain.Patient;
import com.medilink.healthcaresystem.domain.enums.Role;
import com.medilink.healthcaresystem.repository.AuthorityRepository;
import com.medilink.healthcaresystem.repository.PatientRepository;
import com.medilink.healthcaresystem.repository.UserRepository;
import com.medilink.healthcaresystem.service.dto.PatientRegisterRequest;
import com.medilink.healthcaresystem.service.dto.UserResponse;
import java.util.HashSet;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationService verificationService;

    @Transactional
    public UserResponse patientRegister(PatientRegisterRequest request) {
        if (userRepository.findOneByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        Authority patientAuthority = authorityRepository
            .findById("ROLE_PATIENT")
            .orElseThrow(() -> new IllegalStateException("ROLE_PATIENT authority not found"));

        Set<Authority> authorities = new HashSet<>();
        authorities.add(patientAuthority);

        // Patient IS-A User now — build one object, one save, JOINED inheritance
        // writes both jhi_user and patient rows in a single persist.
        Patient patient = Patient.builder()
            .login(request.getEmail())
            .email(request.getEmail())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .password(passwordEncoder.encode(request.getPassword()))
            .activated(true)
            .authorities(authorities)
            .phone(request.getPhone())
            .role(Role.PATIENT)
            .build();

        Patient saved = patientRepository.save(patient);

        verificationService.generateAndSendCode(saved.getEmail());

        return UserResponse.builder()
            .id(saved.getId())
            .firstName(saved.getFirstName())
            .lastName(saved.getLastName())
            .email(saved.getEmail())
            .phone(saved.getPhone())
            .role(Role.PATIENT)
            .build();
    }
}

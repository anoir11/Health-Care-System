package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.Authority;
import com.medilink.healthcaresystem.domain.Patient;
import com.medilink.healthcaresystem.domain.User;
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

    @Transactional
    public UserResponse patientRegister(PatientRegisterRequest request) {
        if (userRepository.findOneByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        // 1. Create the JHipster User (handles login/password/JWT auth)
        User user = new User();
        user.setLogin(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActivated(true);

        Authority patientAuthority = authorityRepository
            .findById("ROLE_PATIENT")
            .orElseThrow(() -> new IllegalStateException("ROLE_PATIENT authority not found"));

        Set<Authority> authorities = new HashSet<>();
        authorities.add(patientAuthority);
        user.setAuthorities(authorities);

        User savedUser = userRepository.save(user);

        // 2. Create the linked Patient profile
        Patient patient = Patient.builder().user(savedUser).phone(request.getPhone()).build();

        Patient saved = patientRepository.save(patient);

        // 3. Map to response
        return UserResponse.builder()
            .id(savedUser.getId())
            .firstName(savedUser.getFirstName())
            .lastName(savedUser.getLastName())
            .email(savedUser.getEmail())
            .phone(saved.getPhone())
            .role(Role.PATIENT)
            .build();
    }
}

package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.User;
import com.medilink.healthcaresystem.repository.UserRepository;
import com.medilink.healthcaresystem.security.JwtService;
import com.medilink.healthcaresystem.service.dto.LoginRequest;
import com.medilink.healthcaresystem.service.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new IllegalStateException("Please verify your email before logging in");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return LoginResponse.builder()
            .token(token)
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}

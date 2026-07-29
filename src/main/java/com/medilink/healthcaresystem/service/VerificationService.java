package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.VerificationCode;
import com.medilink.healthcaresystem.repository.VerificationCodeRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;

    private static final SecureRandom RANDOM = new SecureRandom();

    public void generateAndSendCode(String email) {
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));

        VerificationCode verificationCode = VerificationCode.builder()
            .email(email)
            .code(code)
            .expiresAt(LocalDateTime.now().plusMinutes(15))
            .build();

        verificationCodeRepository.save(verificationCode);
        emailService.sendVerificationCode(email, code);
    }

    public boolean verifyCode(String email, String submittedCode) {
        var latest = verificationCodeRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email).orElse(null);

        if (latest == null) return false;
        if (latest.isUsed()) return false;
        if (latest.getExpiresAt().isBefore(LocalDateTime.now())) return false;
        if (!latest.getCode().equals(submittedCode)) return false;

        latest.setUsed(true);
        verificationCodeRepository.save(latest);
        return true;
    }
}

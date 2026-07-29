package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.enums.Role;
import com.medilink.healthcaresystem.repository.UserRepository;
import com.medilink.healthcaresystem.repository.VerificationCodeRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationCleanupService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final UserRepository userRepository;

    // Runs once a day at 3 AM
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupExpiredCodes() {
        verificationCodeRepository.deleteExpiredCodes(LocalDateTime.now());
    }

    @Scheduled(cron = "0 5 3 * * *")
    public void cleanupAbandonedAccounts() {
        // Patients: 24h grace period — low-effort signup, safe to clean fast
        var abandonedPatients = userRepository.findAllByActivatedFalseAndRoleAndCreatedDateBefore(
            Role.PATIENT,
            LocalDateTime.now().minusHours(24)
        );
        userRepository.deleteAll(abandonedPatients);

        // Doctors: 7-day grace period — they invested effort uploading documents
        var abandonedDoctors = userRepository.findAllByActivatedFalseAndRoleAndCreatedDateBefore(
            Role.DOCTOR,
            LocalDateTime.now().minusDays(7)
        );
        userRepository.deleteAll(abandonedDoctors);
    }
}

package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.Authority;
import com.medilink.healthcaresystem.domain.Doctor;
import com.medilink.healthcaresystem.domain.DoctorDocument;
import com.medilink.healthcaresystem.domain.User;
import com.medilink.healthcaresystem.domain.enums.DocumentType;
import com.medilink.healthcaresystem.domain.enums.Role;
import com.medilink.healthcaresystem.domain.enums.VerificationStatus;
import com.medilink.healthcaresystem.repository.AuthorityRepository;
import com.medilink.healthcaresystem.repository.DoctorRepository;
import com.medilink.healthcaresystem.repository.UserRepository;
import com.medilink.healthcaresystem.service.dto.DoctorRegisterRequest;
import com.medilink.healthcaresystem.service.dto.UserResponse;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public UserResponse doctorRegister(DoctorRegisterRequest request) {
        if (userRepository.findOneByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (doctorRepository.findByLicenseNumber(request.getLicenseNumber()).isPresent()) {
            throw new IllegalArgumentException("License number already in use");
        }

        // 1. Create the JHipster User (handles login/password/JWT auth)
        User user = new User();
        user.setLogin(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActivated(true);

        Authority doctorAuthority = authorityRepository
            .findById("ROLE_DOCTOR")
            .orElseThrow(() -> new IllegalStateException("ROLE_DOCTOR authority not found"));
        Set<Authority> authorities = new HashSet<>();
        authorities.add(doctorAuthority);
        user.setAuthorities(authorities);

        User savedUser = userRepository.save(user);

        // 2. Create the linked Doctor profile
        Doctor doctor = Doctor.builder()
            .user(savedUser)
            .phone(request.getPhone())
            .specialty(request.getSpecialty())
            .licenseNumber(request.getLicenseNumber())
            .cinNumber(request.getCinNumber())
            .clinicName(request.getClinicName())
            .yearsExperience(request.getYearsExperience())
            .verificationStatus(VerificationStatus.PENDING)
            .build();

        Doctor saved = doctorRepository.save(doctor);

        // 3. Upload and attach documents
        List<DoctorDocument> documents = new ArrayList<>();
        documents.add(uploadDocument(saved, request.getCinDocument(), DocumentType.CIN));
        documents.add(uploadDocument(saved, request.getDiplomaDocument(), DocumentType.DIPLOMA));
        documents.add(uploadDocument(saved, request.getCvDocument(), DocumentType.CV));

        if (request.getLicenseDocument() != null && !request.getLicenseDocument().isEmpty()) {
            documents.add(uploadDocument(saved, request.getLicenseDocument(), DocumentType.LICENSE));
        }

        saved.getDocuments().addAll(documents);
        doctorRepository.save(saved);

        // 4. Map to response
        return UserResponse.builder()
            .id(savedUser.getId())
            .firstName(savedUser.getFirstName())
            .lastName(savedUser.getLastName())
            .email(savedUser.getEmail())
            .phone(saved.getPhone())
            .role(Role.DOCTOR)
            .build();
    }

    private DoctorDocument uploadDocument(Doctor doctor, MultipartFile file, DocumentType type) {
        Map<?, ?> result = cloudinaryService.upload(file);

        return DoctorDocument.builder()
            .doctor(doctor)
            .type(type)
            .fileUrl((String) result.get("secure_url"))
            .publicId((String) result.get("public_id"))
            .fileName(file.getOriginalFilename())
            .fileType(file.getContentType())
            .fileSize(file.getSize())
            .build();
    }
}

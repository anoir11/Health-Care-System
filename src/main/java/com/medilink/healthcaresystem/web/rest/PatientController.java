package com.medilink.healthcaresystem.web.rest;

import com.medilink.healthcaresystem.domain.Patient;
import com.medilink.healthcaresystem.domain.User;
import com.medilink.healthcaresystem.repository.PatientRepository;
import com.medilink.healthcaresystem.service.EmergencyContactService;
import com.medilink.healthcaresystem.service.InsuranceService;
import com.medilink.healthcaresystem.service.PatientProfileService;
import com.medilink.healthcaresystem.service.dto.EmergencyContactRequest;
import com.medilink.healthcaresystem.service.dto.EmergencyContactResponse;
import com.medilink.healthcaresystem.service.dto.InsuranceRequest;
import com.medilink.healthcaresystem.service.dto.InsuranceResponse;
import com.medilink.healthcaresystem.service.dto.PatientProfileResponse;
import com.medilink.healthcaresystem.service.dto.UpdatePatientProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientProfileService patientProfileService;
    private final EmergencyContactService emergencyContactService;
    private final InsuranceService insuranceService;
    private final PatientRepository patientRepository; // Add this

    @GetMapping("/me")
    public ResponseEntity<PatientProfileResponse> getMyProfile(Authentication authentication) {
        Patient patient = extractPatient(authentication);
        return ResponseEntity.ok(patientProfileService.getProfile(patient));
    }

    @PutMapping("/me")
    public ResponseEntity<PatientProfileResponse> updateMyProfile(
        Authentication authentication,
        @Valid @RequestBody UpdatePatientProfileRequest request
    ) {
        Patient patient = extractPatient(authentication);
        return ResponseEntity.ok(patientProfileService.updateProfile(patient, request));
    }

    // ── Emergency contacts ──────────────────────────────────────────

    @PostMapping("/me/emergency-contacts")
    public ResponseEntity<EmergencyContactResponse> addEmergencyContact(
        Authentication authentication,
        @Valid @RequestBody EmergencyContactRequest request
    ) {
        Patient patient = extractPatient(authentication);
        EmergencyContactResponse response = emergencyContactService.addContact(patient, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/me/emergency-contacts/{contactId}")
    public ResponseEntity<EmergencyContactResponse> updateEmergencyContact(
        Authentication authentication,
        @PathVariable Long contactId,
        @Valid @RequestBody EmergencyContactRequest request
    ) {
        Patient patient = extractPatient(authentication);
        EmergencyContactResponse response = emergencyContactService.updateContact(patient, contactId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me/emergency-contacts/{contactId}")
    public ResponseEntity<Void> deleteEmergencyContact(Authentication authentication, @PathVariable Long contactId) {
        Patient patient = extractPatient(authentication);
        emergencyContactService.deleteContact(patient, contactId);
        return ResponseEntity.noContent().build();
    }

    // ── Insurance ────────────────────────────────────────────────────

    @PutMapping("/me/insurance")
    public ResponseEntity<InsuranceResponse> updateInsurance(Authentication authentication, @Valid @RequestBody InsuranceRequest request) {
        Patient patient = extractPatient(authentication);
        InsuranceResponse response = insuranceService.createOrUpdate(patient, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me/insurance")
    public ResponseEntity<Void> deleteInsurance(Authentication authentication) {
        Patient patient = extractPatient(authentication);
        insuranceService.deleteInsurance(patient);
        return ResponseEntity.noContent().build();
    }

    private Patient extractPatient(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        // Find the patient by the user's ID
        return patientRepository
            .findById(user.getId())
            .orElseThrow(() -> new IllegalStateException("Patient profile not found for user: " + user.getEmail()));
    }
}

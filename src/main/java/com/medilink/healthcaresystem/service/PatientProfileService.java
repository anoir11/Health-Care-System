package com.medilink.healthcaresystem.service;

// import com.medilink.healthcaresystem.dto.*;
import com.medilink.healthcaresystem.domain.Patient;
// import com.medilink.healthcaresystem.enums.AccessStatus;
// import com.medilink.healthcaresystem.repository.FolderAccessRepository;
import com.medilink.healthcaresystem.repository.PatientRepository;
import com.medilink.healthcaresystem.service.dto.EmergencyContactResponse;
import com.medilink.healthcaresystem.service.dto.InsuranceResponse;
import com.medilink.healthcaresystem.service.dto.PatientProfileResponse;
import com.medilink.healthcaresystem.service.dto.UpdatePatientProfileRequest;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final PatientRepository patientRepository;

    // private final FolderAccessRepository folderAccessRepository;

    @Transactional(readOnly = true)
    public PatientProfileResponse getProfile(Patient detachedPatient) {
        Patient patient = patientRepository
            .findById(detachedPatient.getId())
            .orElseThrow(() -> new IllegalStateException("Patient not found"));
        // long activeDoctors = folderAccessRepository.countByPatientAndStatus(patient, AccessStatus.GRANTED);

        return PatientProfileResponse.builder()
            .id(patient.getId())
            .firstName(patient.getFirstName())
            .lastName(patient.getLastName())
            .email(patient.getEmail())
            .phone(patient.getPhone())
            .gender(patient.getGender())
            .dateOfBirth(patient.getDateOfBirth())
            .nationality(patient.getNationality())
            .address(patient.getAddress())
            .city(patient.getCity())
            .bloodType(patient.getBloodType())
            .height(patient.getHeight())
            .weight(patient.getWeight())
            .smoking(patient.isSmoking())
            .alcohol(patient.isAlcohol())
            .allergies(patient.getAllergies())
            .conditions(patient.getConditions())
            .currentMedications(patient.getCurrentMedications())
            .emergencyContacts(mapContacts(patient))
            .insurance(mapInsurance(patient))
            // .activeDoctors(activeDoctors)
            .build();
    }

    @Transactional
    public PatientProfileResponse updateProfile(Patient detachedPatient, UpdatePatientProfileRequest request) {
        Patient patient = patientRepository
            .findById(detachedPatient.getId())
            .orElseThrow(() -> new IllegalStateException("Patient not found"));

        if (request.getFirstName() != null) patient.setFirstName(request.getFirstName());
        if (request.getLastName() != null) patient.setLastName(request.getLastName());
        if (request.getPhone() != null) patient.setPhone(request.getPhone());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getNationality() != null) patient.setNationality(request.getNationality());
        if (request.getAddress() != null) patient.setAddress(request.getAddress());
        if (request.getCity() != null) patient.setCity(request.getCity());
        if (request.getBloodType() != null) patient.setBloodType(request.getBloodType());
        if (request.getHeight() != null) patient.setHeight(request.getHeight());
        if (request.getWeight() != null) patient.setWeight(request.getWeight());
        patient.setSmoking(request.isSmoking());
        patient.setAlcohol(request.isAlcohol());
        if (request.getAllergies() != null) patient.setAllergies(request.getAllergies());
        if (request.getConditions() != null) patient.setConditions(request.getConditions());
        if (request.getCurrentMedications() != null) patient.setCurrentMedications(request.getCurrentMedications());

        Patient saved = patientRepository.save(patient);
        return getProfile(saved);
    }

    private List<EmergencyContactResponse> mapContacts(Patient patient) {
        return patient
            .getEmergencyContacts()
            .stream()
            .map(ec ->
                EmergencyContactResponse.builder()
                    .id(ec.getId())
                    .name(ec.getName())
                    .relationship(ec.getRelationship())
                    .phone(ec.getPhone())
                    .role(ec.getRole())
                    .build()
            )
            .collect(Collectors.toList());
    }

    private InsuranceResponse mapInsurance(Patient patient) {
        if (patient.getInsurance() == null) return null;
        var ins = patient.getInsurance();
        return InsuranceResponse.builder()
            .provider(ins.getProvider())
            .policyNumber(ins.getPolicyNumber())
            .expiryDate(ins.getExpiryDate())
            .coverage(ins.getCoverage())
            .active(ins.isActive())
            .build();
    }
}

package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.EmergencyContact;
import com.medilink.healthcaresystem.domain.Patient;
import com.medilink.healthcaresystem.repository.EmergencyContactRepository;
import com.medilink.healthcaresystem.repository.PatientRepository;
import com.medilink.healthcaresystem.service.dto.EmergencyContactRequest;
import com.medilink.healthcaresystem.service.dto.EmergencyContactResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmergencyContactService {

    private final EmergencyContactRepository emergencyContactRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public EmergencyContactResponse addContact(Patient detachedPatient, EmergencyContactRequest request) {
        Patient patient = patientRepository
            .findById(detachedPatient.getId())
            .orElseThrow(() -> new IllegalStateException("Patient not found"));

        EmergencyContact contact = EmergencyContact.builder()
            .patient(patient)
            .name(request.getName())
            .relationship(request.getRelationship())
            .phone(request.getPhone())
            .role(request.getRole())
            .build();

        EmergencyContact saved = emergencyContactRepository.save(contact);
        return toResponse(saved);
    }

    @Transactional
    public EmergencyContactResponse updateContact(Patient detachedPatient, Long contactId, EmergencyContactRequest request) {
        Patient patient = patientRepository
            .findById(detachedPatient.getId())
            .orElseThrow(() -> new IllegalStateException("Patient not found"));

        EmergencyContact contact = emergencyContactRepository
            .findByIdAndPatient(contactId, patient)
            .orElseThrow(() -> new IllegalArgumentException("Contact not found"));

        contact.setName(request.getName());
        contact.setRelationship(request.getRelationship());
        contact.setPhone(request.getPhone());
        contact.setRole(request.getRole());

        EmergencyContact saved = emergencyContactRepository.save(contact);
        return toResponse(saved);
    }

    @Transactional
    public void deleteContact(Patient detachedPatient, Long contactId) {
        Patient patient = patientRepository
            .findById(detachedPatient.getId())
            .orElseThrow(() -> new IllegalStateException("Patient not found"));

        EmergencyContact contact = emergencyContactRepository
            .findByIdAndPatient(contactId, patient)
            .orElseThrow(() -> new IllegalArgumentException("Contact not found"));

        emergencyContactRepository.delete(contact);
    }

    private EmergencyContactResponse toResponse(EmergencyContact ec) {
        return EmergencyContactResponse.builder()
            .id(ec.getId())
            .name(ec.getName())
            .relationship(ec.getRelationship())
            .phone(ec.getPhone())
            .role(ec.getRole())
            .build();
    }
}

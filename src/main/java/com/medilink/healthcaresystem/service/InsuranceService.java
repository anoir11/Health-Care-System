package com.medilink.healthcaresystem.service;

import com.medilink.healthcaresystem.domain.Insurance;
import com.medilink.healthcaresystem.domain.Patient;
import com.medilink.healthcaresystem.repository.InsuranceRepository;
import com.medilink.healthcaresystem.repository.PatientRepository;
import com.medilink.healthcaresystem.service.dto.InsuranceRequest;
import com.medilink.healthcaresystem.service.dto.InsuranceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InsuranceService {

    private final InsuranceRepository insuranceRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public InsuranceResponse createOrUpdate(Patient detachedPatient, InsuranceRequest request) {
        Patient patient = patientRepository
            .findById(detachedPatient.getId())
            .orElseThrow(() -> new IllegalStateException("Patient not found"));

        Insurance insurance = patient.getInsurance();

        if (insurance == null) {
            insurance = Insurance.builder().patient(patient).build();
        }

        insurance.setProvider(request.getProvider());
        insurance.setPolicyNumber(request.getPolicyNumber());
        insurance.setExpiryDate(request.getExpiryDate());
        insurance.setCoverage(request.getCoverage());
        insurance.setActive(request.isActive());

        Insurance saved = insuranceRepository.save(insurance);
        return toResponse(saved);
    }

    @Transactional
    public void deleteInsurance(Patient detachedPatient) {
        Patient patient = patientRepository
            .findById(detachedPatient.getId())
            .orElseThrow(() -> new IllegalStateException("Patient not found"));

        if (patient.getInsurance() != null) {
            insuranceRepository.delete(patient.getInsurance());
        }
    }

    private InsuranceResponse toResponse(Insurance ins) {
        return InsuranceResponse.builder()
            .provider(ins.getProvider())
            .policyNumber(ins.getPolicyNumber())
            .expiryDate(ins.getExpiryDate())
            .coverage(ins.getCoverage())
            .active(ins.isActive())
            .build();
    }
}

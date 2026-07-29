package com.medilink.healthcaresystem.repository;

import com.medilink.healthcaresystem.domain.EmergencyContact;
import com.medilink.healthcaresystem.domain.Patient;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {
    Optional<EmergencyContact> findByIdAndPatient(Long id, Patient patient);
}

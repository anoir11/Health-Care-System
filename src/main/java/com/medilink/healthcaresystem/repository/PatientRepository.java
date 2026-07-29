package com.medilink.healthcaresystem.repository;

import com.medilink.healthcaresystem.domain.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {}

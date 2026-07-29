package com.medilink.healthcaresystem.service.dto;

import com.medilink.healthcaresystem.domain.enums.BloodType;
import com.medilink.healthcaresystem.domain.enums.Gender;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PatientProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    private Gender gender;
    private LocalDate dateOfBirth;
    private String nationality;
    private String address;
    private String city;
    private BloodType bloodType;
    private Integer height;
    private Integer weight;
    private boolean smoking;
    private boolean alcohol;

    private List<String> allergies;
    private List<String> conditions;
    private List<String> currentMedications;

    private List<EmergencyContactResponse> emergencyContacts;
    private InsuranceResponse insurance;

    private long activeDoctors;
}

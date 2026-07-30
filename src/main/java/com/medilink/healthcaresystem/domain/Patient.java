package com.medilink.healthcaresystem.domain;

import com.medilink.healthcaresystem.domain.enums.BloodType;
import com.medilink.healthcaresystem.domain.enums.Gender;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Patient extends User {

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate dateOfBirth;

    private String nationality;

    private String address;

    private String city;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private Integer height; // cm

    private Integer weight; // kg

    private boolean smoking;

    private boolean alcohol;

    @ElementCollection
    @CollectionTable(name = "patient_allergies", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "allergy")
    @Builder.Default
    private List<String> allergies = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "patient_conditions", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "condition_name")
    @Builder.Default
    private List<String> conditions = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "patient_medications", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "medication")
    @Builder.Default
    private List<String> currentMedications = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EmergencyContact> emergencyContacts = new ArrayList<>();

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private Insurance insurance;
}

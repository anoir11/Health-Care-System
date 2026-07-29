package com.medilink.healthcaresystem.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(name = "insurances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(nullable = false)
    private String provider;

    @Column(nullable = false)
    private String policyNumber;

    private LocalDate expiryDate;

    private String coverage; // "Full", "Partial", etc — could become an enum later if values are fixed

    @Column(nullable = false)
    private boolean active = true;
}

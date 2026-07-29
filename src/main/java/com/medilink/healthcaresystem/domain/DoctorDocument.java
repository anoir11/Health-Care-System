package com.medilink.healthcaresystem.domain;

import com.medilink.healthcaresystem.domain.enums.DocumentType;
import jakarta.persistence.*;
// import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "doctor_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type; // CIN, DIPLOMA, CV, LICENSE

    @Column(nullable = false)
    private String fileUrl; // Cloudinary secure_url

    @Column(nullable = false)
    private String publicId; // Cloudinary public_id — needed to delete/replace later

    private String fileName; // original file name, for display
    private String fileType; // pdf, jpg, png...
    private Long fileSize; // bytes, optional but handy for UI

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    void onUpload() {
        this.uploadedAt = LocalDateTime.now();
    }
}

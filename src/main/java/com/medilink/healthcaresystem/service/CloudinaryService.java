package com.medilink.healthcaresystem.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<?, ?> upload(MultipartFile file) {
        try {
            return cloudinary
                .uploader()
                .upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                        "resource_type",
                        "auto", // handles pdf, jpg, png automatically
                        "folder",
                        "medilink/doctor_documents"
                    )
                );
        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    public void delete(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("File deletion failed: " + e.getMessage());
        }
    }
}

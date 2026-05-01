package com.example.DocUsafe.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.DocUsafe.exception.BadRequestException;

@Service
public class StorageService {

    private final Path storagePath;
    private final long maxFileSize;
    private final Set<String> allowedTypes;

    public StorageService(
        @Value("${app.storage.path}") String storagePath,
        @Value("${app.storage.max-file-size}") long maxFileSize,
        @Value("${app.storage.allowed-types}") String allowedTypes
    ) {
        this.storagePath = Path.of(storagePath).toAbsolutePath().normalize();
        this.maxFileSize = maxFileSize;
        this.allowedTypes = Arrays.stream(allowedTypes.split(","))
            .map(String::trim)
            .filter(value -> !value.isEmpty())
            .collect(Collectors.toSet());
        init();
    }

    public StoredFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        if (file.getSize() > maxFileSize) {
            throw new BadRequestException("File exceeds maximum allowed size");
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new BadRequestException("File type is not allowed");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        if (originalName == null || originalName.isBlank()) {
            originalName = "upload.bin";
        }

        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedName = UUID.randomUUID() + "_" + safeName;
        Path target = storagePath.resolve(storedName).normalize();

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to store file");
        }

        return new StoredFile(originalName, storedName);
    }

    public Resource loadAsResource(String storedPath) {
        Path filePath = storagePath.resolve(storedPath).normalize();
        if (!Files.exists(filePath)) {
            throw new BadRequestException("File not found on disk");
        }
        return new FileSystemResource(filePath);
    }

    public void delete(String storedPath) {
        if (storedPath == null || storedPath.isBlank()) {
            return;
        }
        Path filePath = storagePath.resolve(storedPath).normalize();
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to delete file");
        }
    }

    private void init() {
        try {
            Files.createDirectories(storagePath);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to initialize storage directory");
        }
    }

    public record StoredFile(String originalName, String storedName) {}
}

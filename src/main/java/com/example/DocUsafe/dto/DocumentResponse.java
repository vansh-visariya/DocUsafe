package com.example.DocUsafe.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.example.DocUsafe.model.DocumentStatus;
import com.example.DocUsafe.model.UserRole;

public record DocumentResponse(
    UUID id,
    String title,
    String description,
    String fileName,
    String fileType,
    long fileSize,
    DocumentStatus status,
    String rejectionReason,
    String reviewRemarks,
    Instant uploadedAt,
    Instant verifiedAt,
    String downloadUrl,
    UserSummary uploadedBy,
    UserSummary verifiedBy,
    UserSummary rejectedBy,
    List<UserSummary> sharedWith
) {
    public record UserSummary(UUID id, String name, String email, UserRole role) {}
}

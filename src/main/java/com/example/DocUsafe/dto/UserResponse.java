package com.example.DocUsafe.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.DocUsafe.model.UserRole;

public record UserResponse(
    UUID id,
    String name,
    String email,
    UserRole role,
    String enrollmentNumber,
    String course,
    Integer year,
    boolean active,
    Instant createdAt,
    Instant updatedAt
) {}

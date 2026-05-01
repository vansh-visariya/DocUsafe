package com.example.DocUsafe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import com.example.DocUsafe.model.UserRole;

public record RegisterRequest(
    @NotBlank String name,
    @Email @NotBlank String email,
    @NotBlank String password,
    UserRole role,
    String enrollmentNumber,
    String course,
    Integer year
) {}

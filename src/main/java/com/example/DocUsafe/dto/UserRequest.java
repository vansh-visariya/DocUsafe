package com.example.DocUsafe.dto;

import com.example.DocUsafe.model.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequest(
    @NotBlank String name,
    @Email @NotBlank String email,
    String password,
    @NotNull UserRole role,
    String enrollmentNumber,
    String course,
    Integer year,
    Boolean active
) {}

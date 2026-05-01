package com.example.DocUsafe.dto;

import jakarta.validation.constraints.NotBlank;

public record DocumentRejectRequest(@NotBlank String reason) {}

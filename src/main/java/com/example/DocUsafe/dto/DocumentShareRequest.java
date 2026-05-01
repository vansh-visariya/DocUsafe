package com.example.DocUsafe.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record DocumentShareRequest(
    @NotEmpty List<UUID> teacherIds,
    boolean replace
) {}

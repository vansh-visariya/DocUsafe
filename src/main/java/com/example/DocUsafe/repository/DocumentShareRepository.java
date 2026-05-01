package com.example.DocUsafe.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DocUsafe.model.DocumentShare;

public interface DocumentShareRepository extends JpaRepository<DocumentShare, UUID> {
    List<DocumentShare> findByDocument_Id(UUID documentId);

    List<DocumentShare> findByTeacher_Id(UUID teacherId);

    boolean existsByDocument_IdAndTeacher_Id(UUID documentId, UUID teacherId);

    void deleteByDocument_Id(UUID documentId);
}

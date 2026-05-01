package com.example.DocUsafe.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DocUsafe.model.Document;
import com.example.DocUsafe.model.DocumentStatus;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByStatus(DocumentStatus status);

    List<Document> findByUploadedBy_Id(UUID uploadedById);

    List<Document> findByStatusAndUploadedBy_Id(DocumentStatus status, UUID uploadedById);
}

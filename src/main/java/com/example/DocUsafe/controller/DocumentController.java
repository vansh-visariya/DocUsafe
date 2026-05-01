package com.example.DocUsafe.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DocUsafe.dto.ApiResponse;
import com.example.DocUsafe.dto.DocumentRejectRequest;
import com.example.DocUsafe.dto.DocumentResponse;
import com.example.DocUsafe.dto.DocumentShareRequest;
import com.example.DocUsafe.dto.DocumentVerifyRequest;
import com.example.DocUsafe.model.DocumentStatus;
import com.example.DocUsafe.service.DocumentService;
import com.example.DocUsafe.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<DocumentResponse> upload(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestParam String title,
        @RequestParam(required = false) String description,
        @RequestPart("file") MultipartFile file
    ) {
        return ApiResponse.success("Document uploaded", documentService.upload(principal, title, description, file));
    }

    @GetMapping
    public ApiResponse<List<DocumentResponse>> list(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) UUID uploadedById
    ) {
        DocumentStatus parsedStatus = parseStatus(status);
        return ApiResponse.success("Documents fetched", documentService.list(principal, parsedStatus, uploadedById));
    }

    @GetMapping("/{id}")
    public ApiResponse<DocumentResponse> get(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id
    ) {
        return ApiResponse.success("Document fetched", documentService.get(principal, id));
    }

    @PutMapping("/{id}/verify")
    public ApiResponse<DocumentResponse> verify(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @RequestBody(required = false) DocumentVerifyRequest request
    ) {
        return ApiResponse.success("Document verified", documentService.verify(principal, id, request));
    }

    @PutMapping("/{id}/reject")
    public ApiResponse<DocumentResponse> reject(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @Valid @RequestBody DocumentRejectRequest request
    ) {
        return ApiResponse.success("Document rejected", documentService.reject(principal, id, request));
    }

    @PutMapping("/{id}/share")
    public ApiResponse<DocumentResponse> share(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @Valid @RequestBody DocumentShareRequest request
    ) {
        return ApiResponse.success("Document shared", documentService.share(principal, id, request));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id
    ) {
        DocumentResponse document = documentService.get(principal, id);
        Resource resource = documentService.download(principal, id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.fileName() + "\"")
            .contentType(MediaType.parseMediaType(document.fileType()))
            .body(resource);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id
    ) {
        documentService.delete(principal, id);
        return ApiResponse.success("Document deleted", null);
    }

    private DocumentStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return DocumentStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}

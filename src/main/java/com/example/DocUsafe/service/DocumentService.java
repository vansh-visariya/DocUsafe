package com.example.DocUsafe.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.DocUsafe.dto.DocumentRejectRequest;
import com.example.DocUsafe.dto.DocumentResponse;
import com.example.DocUsafe.dto.DocumentResponse.UserSummary;
import com.example.DocUsafe.dto.DocumentShareRequest;
import com.example.DocUsafe.dto.DocumentVerifyRequest;
import com.example.DocUsafe.exception.BadRequestException;
import com.example.DocUsafe.exception.ResourceNotFoundException;
import com.example.DocUsafe.model.Document;
import com.example.DocUsafe.model.DocumentShare;
import com.example.DocUsafe.model.DocumentStatus;
import com.example.DocUsafe.model.User;
import com.example.DocUsafe.model.UserRole;
import com.example.DocUsafe.repository.DocumentRepository;
import com.example.DocUsafe.repository.DocumentShareRepository;
import com.example.DocUsafe.repository.UserRepository;
import com.example.DocUsafe.security.UserPrincipal;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentShareRepository documentShareRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    public DocumentService(
        DocumentRepository documentRepository,
        DocumentShareRepository documentShareRepository,
        UserRepository userRepository,
        StorageService storageService
    ) {
        this.documentRepository = documentRepository;
        this.documentShareRepository = documentShareRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    @Transactional
    public DocumentResponse upload(UserPrincipal principal, String title, String description, MultipartFile file) {
        if (principal.getRole() != UserRole.STUDENT) {
            throw new AccessDeniedException("Only students can upload documents");
        }

        User uploader = loadUser(principal.getId());
        StorageService.StoredFile storedFile = storageService.store(file);

        Document document = new Document();
        document.setTitle(title);
        document.setDescription(description);
        document.setFileName(storedFile.originalName());
        document.setFilePath(storedFile.storedName());
        document.setFileType(file.getContentType() == null ? "application/octet-stream" : file.getContentType());
        document.setFileSize(file.getSize());
        document.setStatus(DocumentStatus.PENDING);
        document.setUploadedBy(uploader);

        Document saved = documentRepository.save(document);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> list(UserPrincipal principal, DocumentStatus status, UUID uploadedById) {
        if (principal.getRole() == UserRole.ADMIN) {
            return listForAdmin(status, uploadedById);
        }

        if (principal.getRole() == UserRole.TEACHER) {
            return listForTeacher(principal.getId(), status);
        }

        return listForStudent(principal.getId(), status);
    }

    @Transactional(readOnly = true)
    public DocumentResponse get(UserPrincipal principal, UUID id) {
        Document document = findDocument(id);
        ensureAccess(principal, document);
        return toResponse(document);
    }

    @Transactional
    public DocumentResponse verify(UserPrincipal principal, UUID id, DocumentVerifyRequest request) {
        Document document = findDocument(id);
        ensureReviewerAccess(principal, document);

        document.setStatus(DocumentStatus.VERIFIED);
        document.setVerifiedAt(Instant.now());
        document.setRejectionReason(null);
        document.setReviewRemarks(request == null ? null : request.remarks());
        document.setVerifiedBy(loadUser(principal.getId()));
        document.setRejectedBy(null);

        return toResponse(documentRepository.save(document));
    }

    @Transactional
    public DocumentResponse reject(UserPrincipal principal, UUID id, DocumentRejectRequest request) {
        Document document = findDocument(id);
        ensureReviewerAccess(principal, document);

        document.setStatus(DocumentStatus.REJECTED);
        document.setVerifiedAt(Instant.now());
        document.setRejectionReason(request.reason());
        document.setReviewRemarks(request.reason());
        document.setVerifiedBy(null);
        document.setRejectedBy(loadUser(principal.getId()));

        return toResponse(documentRepository.save(document));
    }

    @Transactional
    public DocumentResponse share(UserPrincipal principal, UUID id, DocumentShareRequest request) {
        Document document = findDocument(id);
        if (principal.getRole() == UserRole.TEACHER) {
            throw new AccessDeniedException("Teachers cannot share documents");
        }

        if (principal.getRole() == UserRole.STUDENT
            && !document.getUploadedBy().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You can only share your own documents");
        }

        if (request.replace()) {
            documentShareRepository.deleteByDocument_Id(document.getId());
        }

        User sharedBy = loadUser(principal.getId());
        for (UUID teacherId : request.teacherIds()) {
            User teacher = loadUser(teacherId);
            if (teacher.getRole() != UserRole.TEACHER) {
                throw new BadRequestException("Only teachers can be shared with");
            }
            if (!documentShareRepository.existsByDocument_IdAndTeacher_Id(document.getId(), teacherId)) {
                DocumentShare share = new DocumentShare();
                share.setDocument(document);
                share.setTeacher(teacher);
                share.setSharedBy(sharedBy);
                documentShareRepository.save(share);
            }
        }

        return toResponse(document);
    }

    @Transactional
    public void delete(UserPrincipal principal, UUID id) {
        Document document = findDocument(id);
        if (principal.getRole() != UserRole.ADMIN
            && !document.getUploadedBy().getId().equals(principal.getId())) {
            throw new AccessDeniedException("Not allowed to delete this document");
        }
        storageService.delete(document.getFilePath());
        documentRepository.delete(document);
    }

    @Transactional(readOnly = true)
    public Resource download(UserPrincipal principal, UUID id) {
        Document document = findDocument(id);
        ensureAccess(principal, document);
        return storageService.loadAsResource(document.getFilePath());
    }

    @Transactional(readOnly = true)
    public Document findDocument(UUID id) {
        return documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private List<DocumentResponse> listForAdmin(DocumentStatus status, UUID uploadedById) {
        List<Document> documents;
        if (uploadedById != null && status != null) {
            documents = documentRepository.findByStatusAndUploadedBy_Id(status, uploadedById);
        } else if (uploadedById != null) {
            documents = documentRepository.findByUploadedBy_Id(uploadedById);
        } else if (status != null) {
            documents = documentRepository.findByStatus(status);
        } else {
            documents = documentRepository.findAll();
        }
        return documents.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private List<DocumentResponse> listForStudent(UUID studentId, DocumentStatus status) {
        List<Document> documents = status == null
            ? documentRepository.findByUploadedBy_Id(studentId)
            : documentRepository.findByStatusAndUploadedBy_Id(status, studentId);
        return documents.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private List<DocumentResponse> listForTeacher(UUID teacherId, DocumentStatus status) {
        List<DocumentShare> shares = documentShareRepository.findByTeacher_Id(teacherId);
        return shares.stream()
            .map(DocumentShare::getDocument)
            .filter(document -> status == null || document.getStatus() == status)
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private User loadUser(UUID userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void ensureAccess(UserPrincipal principal, Document document) {
        if (principal.getRole() == UserRole.ADMIN) {
            return;
        }
        if (principal.getRole() == UserRole.STUDENT
            && document.getUploadedBy().getId().equals(principal.getId())) {
            return;
        }
        if (principal.getRole() == UserRole.TEACHER
            && documentShareRepository.existsByDocument_IdAndTeacher_Id(document.getId(), principal.getId())) {
            return;
        }
        throw new AccessDeniedException("Not allowed to access this document");
    }

    private void ensureReviewerAccess(UserPrincipal principal, Document document) {
        if (principal.getRole() == UserRole.ADMIN) {
            return;
        }
        if (principal.getRole() == UserRole.TEACHER
            && documentShareRepository.existsByDocument_IdAndTeacher_Id(document.getId(), principal.getId())) {
            return;
        }
        throw new AccessDeniedException("Not allowed to review this document");
    }

    private DocumentResponse toResponse(Document document) {
        User uploader = document.getUploadedBy();
        User verifier = document.getVerifiedBy();
        User rejecter = document.getRejectedBy();

        UserSummary uploadedBy = uploader == null ? null : new UserSummary(
            uploader.getId(),
            uploader.getName(),
            uploader.getEmail(),
            uploader.getRole()
        );

        UserSummary verifiedBy = verifier == null ? null : new UserSummary(
            verifier.getId(),
            verifier.getName(),
            verifier.getEmail(),
            verifier.getRole()
        );

        UserSummary rejectedBy = rejecter == null ? null : new UserSummary(
            rejecter.getId(),
            rejecter.getName(),
            rejecter.getEmail(),
            rejecter.getRole()
        );

        List<UserSummary> sharedWith = documentShareRepository.findByDocument_Id(document.getId())
            .stream()
            .map(DocumentShare::getTeacher)
            .map(teacher -> new UserSummary(
                teacher.getId(),
                teacher.getName(),
                teacher.getEmail(),
                teacher.getRole()
            ))
            .collect(Collectors.toList());

        return new DocumentResponse(
            document.getId(),
            document.getTitle(),
            document.getDescription(),
            document.getFileName(),
            document.getFileType(),
            document.getFileSize(),
            document.getStatus(),
            document.getRejectionReason(),
            document.getReviewRemarks(),
            document.getUploadedAt(),
            document.getVerifiedAt(),
            "/api/documents/" + document.getId() + "/download",
            uploadedBy,
            verifiedBy,
            rejectedBy,
            sharedWith
        );
    }
}

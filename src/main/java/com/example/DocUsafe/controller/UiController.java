package com.example.DocUsafe.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.DocUsafe.dto.DocumentRejectRequest;
import com.example.DocUsafe.dto.DocumentShareRequest;
import com.example.DocUsafe.dto.DocumentVerifyRequest;
import com.example.DocUsafe.model.DocumentStatus;
import com.example.DocUsafe.model.UserRole;
import com.example.DocUsafe.security.UserPrincipal;
import com.example.DocUsafe.service.DocumentService;
import com.example.DocUsafe.service.UserService;

@Controller
public class UiController {

    private final DocumentService documentService;
    private final UserService userService;

    public UiController(DocumentService documentService, UserService userService) {
        this.documentService = documentService;
        this.userService = userService;
    }

    @GetMapping("/")
    public String root(@AuthenticationPrincipal UserPrincipal principal) {
        return redirectByRole(principal);
    }

    @GetMapping("/ui")
    public String uiRoot(@AuthenticationPrincipal UserPrincipal principal) {
        return redirectByRole(principal);
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/ui/admin")
    public String adminDashboard(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestParam(required = false) String status,
        Model model
    ) {
        DocumentStatus parsed = parseStatus(status);
        model.addAttribute("documents", documentService.list(principal, parsed, null));
        model.addAttribute("status", status == null ? "" : status);
        return "admin-dashboard";
    }

    @PostMapping("/ui/admin/documents/{id}/verify")
    public String adminVerify(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @RequestParam(required = false) String remarks,
        RedirectAttributes redirectAttributes
    ) {
        try {
            documentService.verify(principal, id, new DocumentVerifyRequest(remarks));
            redirectAttributes.addFlashAttribute("message", "Document verified");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ui/admin";
    }

    @PostMapping("/ui/admin/documents/{id}/reject")
    public String adminReject(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @RequestParam String reason,
        RedirectAttributes redirectAttributes
    ) {
        try {
            documentService.reject(principal, id, new DocumentRejectRequest(reason));
            redirectAttributes.addFlashAttribute("message", "Document rejected");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ui/admin";
    }

    @GetMapping("/ui/student")
    public String studentDashboard(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestParam(required = false) String status,
        Model model
    ) {
        DocumentStatus parsed = parseStatus(status);
        model.addAttribute("documents", documentService.list(principal, parsed, null));
        model.addAttribute("teachers", userService.listTeachers());
        model.addAttribute("status", status == null ? "" : status);
        return "student-dashboard";
    }

    @PostMapping("/ui/student/upload")
    public String studentUpload(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestParam String title,
        @RequestParam(required = false) String description,
        @RequestParam("file") MultipartFile file,
        RedirectAttributes redirectAttributes
    ) {
        try {
            documentService.upload(principal, title, description, file);
            redirectAttributes.addFlashAttribute("message", "Document uploaded");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ui/student";
    }

    @PostMapping("/ui/student/documents/share")
    public String studentShare(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestParam UUID documentId,
        @RequestParam List<UUID> teacherIds,
        @RequestParam(defaultValue = "true") boolean replace,
        RedirectAttributes redirectAttributes
    ) {
        try {
            documentService.share(principal, documentId, new DocumentShareRequest(teacherIds, replace));
            redirectAttributes.addFlashAttribute("message", "Document shared");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ui/student";
    }

    @GetMapping("/ui/teacher")
    public String teacherDashboard(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestParam(required = false) String status,
        Model model
    ) {
        DocumentStatus parsed = parseStatus(status);
        model.addAttribute("documents", documentService.list(principal, parsed, null));
        model.addAttribute("status", status == null ? "" : status);
        return "teacher-dashboard";
    }

    @PostMapping("/ui/teacher/documents/{id}/verify")
    public String teacherVerify(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @RequestParam(required = false) String remarks,
        RedirectAttributes redirectAttributes
    ) {
        try {
            documentService.verify(principal, id, new DocumentVerifyRequest(remarks));
            redirectAttributes.addFlashAttribute("message", "Document verified");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ui/teacher";
    }

    @PostMapping("/ui/teacher/documents/{id}/reject")
    public String teacherReject(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @RequestParam String reason,
        RedirectAttributes redirectAttributes
    ) {
        try {
            documentService.reject(principal, id, new DocumentRejectRequest(reason));
            redirectAttributes.addFlashAttribute("message", "Document rejected");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/ui/teacher";
    }

    @GetMapping("/ui/documents/{id}/download")
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> download(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id
    ) {
        var document = documentService.get(principal, id);
        var resource = documentService.download(principal, id);
        return org.springframework.http.ResponseEntity.ok()
            .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.fileName() + "\"")
            .contentType(org.springframework.http.MediaType.parseMediaType(document.fileType()))
            .body(resource);
    }

    private String redirectByRole(UserPrincipal principal) {
        if (principal == null) {
            return "redirect:/login";
        }
        if (principal.getRole() == UserRole.ADMIN) {
            return "redirect:/ui/admin";
        }
        if (principal.getRole() == UserRole.TEACHER) {
            return "redirect:/ui/teacher";
        }
        return "redirect:/ui/student";
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

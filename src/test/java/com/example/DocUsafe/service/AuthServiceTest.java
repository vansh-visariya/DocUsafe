package com.example.DocUsafe.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.DocUsafe.dto.LoginRequest;
import com.example.DocUsafe.dto.RegisterRequest;
import com.example.DocUsafe.exception.BadRequestException;
import com.example.DocUsafe.model.User;
import com.example.DocUsafe.model.UserRole;
import com.example.DocUsafe.repository.UserRepository;
import com.example.DocUsafe.security.JwtService;

class AuthServiceTest {

    @Test
    void register_allows_first_user_role() {
        UserRepository userRepository = mock(UserRepository.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        JwtService jwtService = new JwtService(
            "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
            60000
        );

        when(userRepository.existsByEmail("admin@example.com")).thenReturn(false);
        when(userRepository.count()).thenReturn(0L);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(UUID.randomUUID());
            return user;
        });

        AuthService authService = new AuthService(userRepository, encoder, jwtService);

        RegisterRequest request = new RegisterRequest(
            "Admin User",
            "admin@example.com",
            "Password123!",
            UserRole.ADMIN,
            null,
            null,
            null
        );

        assertEquals(UserRole.ADMIN, authService.register(request).user().role());
    }

    @Test
    void login_rejects_invalid_password() {
        UserRepository userRepository = mock(UserRepository.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        JwtService jwtService = new JwtService(
            "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
            60000
        );

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("student@example.com");
        user.setRole(UserRole.STUDENT);
        user.setActive(true);
        user.setPasswordHash(encoder.encode("correct-password"));

        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));

        AuthService authService = new AuthService(userRepository, encoder, jwtService);

        assertThrows(
            BadRequestException.class,
            () -> authService.login(new LoginRequest("student@example.com", "wrong-password"))
        );
    }

    @Test
    void login_rejects_disabled_user() {
        UserRepository userRepository = mock(UserRepository.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        JwtService jwtService = new JwtService(
            "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
            60000
        );

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("student@example.com");
        user.setRole(UserRole.STUDENT);
        user.setActive(false);
        user.setPasswordHash(encoder.encode("correct-password"));

        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));

        AuthService authService = new AuthService(userRepository, encoder, jwtService);

        assertThrows(
            BadRequestException.class,
            () -> authService.login(new LoginRequest("student@example.com", "correct-password"))
        );
    }
}

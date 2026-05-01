package com.example.DocUsafe.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.DocUsafe.dto.AuthResponse;
import com.example.DocUsafe.dto.LoginRequest;
import com.example.DocUsafe.dto.RegisterRequest;
import com.example.DocUsafe.dto.UserResponse;
import com.example.DocUsafe.exception.BadRequestException;
import com.example.DocUsafe.model.User;
import com.example.DocUsafe.model.UserRole;
import com.example.DocUsafe.repository.UserRepository;
import com.example.DocUsafe.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        UserRole role = UserRole.STUDENT;
        if (userRepository.count() == 0 && request.role() != null) {
            role = request.role();
        }
        user.setRole(role);
        user.setEnrollmentNumber(request.enrollmentNumber());
        user.setCourse(request.course());
        user.setYear(request.year());
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponse(token, toResponse(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!user.isActive()) {
            throw new BadRequestException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, toResponse(user));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getEnrollmentNumber(),
            user.getCourse(),
            user.getYear(),
            user.isActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}

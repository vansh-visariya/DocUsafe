package com.example.DocUsafe.service;

import com.example.DocUsafe.dto.UserRequest;
import com.example.DocUsafe.dto.UserResponse;
import com.example.DocUsafe.exception.BadRequestException;
import com.example.DocUsafe.exception.ResourceNotFoundException;
import com.example.DocUsafe.model.User;
import com.example.DocUsafe.model.UserRole;
import com.example.DocUsafe.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new BadRequestException("Email already exists");
        });

        if (request.password() == null || request.password().isBlank()) {
            throw new BadRequestException("Password is required");
        }

        User user = new User();
        applyRequest(user, request);
        user = userRepository.save(user);
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> list(UserRole role) {
        List<User> users = role == null ? userRepository.findAll() : userRepository.findByRole(role);
        return users.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listTeachers() {
        return userRepository.findByRole(UserRole.TEACHER)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse get(UUID id) {
        return toResponse(findUser(id));
    }

    @Transactional
    public UserResponse update(UUID id, UserRequest request) {
        User user = findUser(id);
        if (!user.getEmail().equalsIgnoreCase(request.email())) {
            userRepository.findByEmail(request.email()).ifPresent(existing -> {
                throw new BadRequestException("Email already exists");
            });
        }
        applyRequest(user, request);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(UUID id) {
        User user = findUser(id);
        userRepository.delete(user);
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void applyRequest(User user, UserRequest request) {
        user.setName(request.name());
        user.setEmail(request.email());
        user.setRole(request.role());
        user.setEnrollmentNumber(request.enrollmentNumber());
        user.setCourse(request.course());
        user.setYear(request.year());
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        if (request.active() != null) {
            user.setActive(request.active());
        }
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

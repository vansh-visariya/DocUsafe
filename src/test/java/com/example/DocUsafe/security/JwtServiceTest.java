package com.example.DocUsafe.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.example.DocUsafe.model.User;
import com.example.DocUsafe.model.UserRole;

class JwtServiceTest {

    @Test
    void generates_and_parses_token_claims() {
        String secret = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        JwtService jwtService = new JwtService(secret, 60000);

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("student@example.com");
        user.setRole(UserRole.STUDENT);
        user.setPasswordHash("hashed");
        user.setActive(true);

        String token = jwtService.generateToken(user);
        UserPrincipal principal = new UserPrincipal(user);

        assertEquals(user.getEmail(), jwtService.extractEmail(token));
        assertEquals(user.getId(), jwtService.extractUserId(token));
        assertEquals(user.getRole(), jwtService.extractRole(token));
        assertTrue(jwtService.isTokenValid(token, principal));
    }
}

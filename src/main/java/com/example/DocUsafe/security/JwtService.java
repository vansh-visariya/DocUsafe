package com.example.DocUsafe.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.DocUsafe.model.User;
import com.example.DocUsafe.model.UserRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(user.getEmail())
            .claims(Map.of(
                "uid", user.getId().toString(),
                "role", user.getRole().name()
            ))
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(expirationMs)))
            .signWith(secretKey)
            .compact();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public UUID extractUserId(String token) {
        String value = getClaims(token).get("uid", String.class);
        return value == null ? null : UUID.fromString(value);
    }

    public UserRole extractRole(String token) {
        String value = getClaims(token).get("role", String.class);
        return value == null ? null : UserRole.valueOf(value);
    }

    public boolean isTokenValid(String token, UserPrincipal principal) {
        String email = extractEmail(token);
        UUID userId = extractUserId(token);
        return email.equals(principal.getUsername()) && userId != null && userId.equals(principal.getId());
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}

package com.example.books.security;

import com.example.books.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;

    public JwtService(AppProperties props) {
        this.key = Keys.hmacShaKeyFor(props.jwtSecret().getBytes(StandardCharsets.UTF_8));
        this.expirationMs = props.jwtExpirationMinutes() * 60_000;
    }

    public String generate(String username, String role) {
        long now = System.currentTimeMillis();
        return Jwts.builder().subject(username).claim("role", role)
            .issuedAt(new Date(now)).expiration(new Date(now + expirationMs))
            .signWith(key).compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}

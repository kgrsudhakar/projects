package com.example.books.security;

import com.example.books.config.AppProperties;
import com.example.books.entity.AppUser;
import com.example.books.entity.RefreshToken;
import com.example.books.repository.RefreshTokenRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

/**
 * Opaque, random, single-use refresh tokens. Each refresh rotates the token.
 * If an already-used token is presented again, every token of that user is revoked (theft detection).
 * Methods run inside the caller's transaction (see AuthService).
 */
@Service
public class RefreshTokenService {
    private final RefreshTokenRepository repo;
    private final long days;
    private final SecureRandom random = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository repo, AppProperties props) {
        this.repo = repo; this.days = props.refreshExpirationDays();
    }

    public String issue(AppUser user) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        repo.save(new RefreshToken(hash(raw), user, Instant.now().plus(days, ChronoUnit.DAYS)));
        return raw;
    }

    /** Validates and revokes the token, returning its owner. */
    public AppUser consume(String raw) {
        RefreshToken t = repo.findByTokenHash(hash(raw))
            .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));
        if (t.isRevoked()) {
            repo.revokeAllForUser(t.getUser());
            throw new BadCredentialsException("Refresh token was already used");
        }
        if (t.getExpiresAt().isBefore(Instant.now())) throw new BadCredentialsException("Refresh token expired");
        t.setRevoked(true);
        return t.getUser();
    }

    public void revoke(String raw) {
        repo.findByTokenHash(hash(raw)).ifPresent(t -> t.setRevoked(true));
    }

    public void revokeAll(AppUser user) { repo.revokeAllForUser(user); }

    public void deleteAll(AppUser user) { repo.deleteAllForUser(user); }

    private static String hash(String raw) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}

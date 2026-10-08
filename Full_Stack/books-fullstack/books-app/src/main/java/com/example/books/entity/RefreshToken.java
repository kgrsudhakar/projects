package com.example.books.entity;

import jakarta.persistence.*;
import java.time.Instant;

/** Only a SHA-256 hash of the token is stored, never the token itself. */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(nullable = false)
    private Instant expiresAt;

    private boolean revoked;

    public RefreshToken() {}
    public RefreshToken(String tokenHash, AppUser user, Instant expiresAt) {
        this.tokenHash = tokenHash; this.user = user; this.expiresAt = expiresAt;
    }

    public AppUser getUser() { return user; }
    public Instant getExpiresAt() { return expiresAt; }
    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }
}

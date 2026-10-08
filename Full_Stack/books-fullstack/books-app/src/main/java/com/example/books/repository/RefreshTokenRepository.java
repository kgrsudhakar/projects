package com.example.books.repository;

import com.example.books.entity.AppUser;
import com.example.books.entity.RefreshToken;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Transactional @Modifying
    @Query("update RefreshToken t set t.revoked = true where t.user = :user")
    void revokeAllForUser(@Param("user") AppUser user);

    @Transactional @Modifying
    @Query("delete from RefreshToken t where t.user = :user")
    void deleteAllForUser(@Param("user") AppUser user);

    @Transactional @Modifying
    @Query("delete from RefreshToken t where t.expiresAt < :now")
    int deleteExpired(@Param("now") Instant now);
}

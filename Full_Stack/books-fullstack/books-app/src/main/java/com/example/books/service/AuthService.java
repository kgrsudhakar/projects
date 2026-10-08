package com.example.books.service;

import com.example.books.dto.Dtos.*;
import com.example.books.entity.AppUser;
import com.example.books.repository.UserRepository;
import com.example.books.security.JwtService;
import com.example.books.security.RefreshTokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwt;
    private final RefreshTokenService refreshTokens;

    public AuthService(UserRepository users, PasswordEncoder encoder, AuthenticationManager authManager,
                       JwtService jwt, RefreshTokenService refreshTokens) {
        this.users = users; this.encoder = encoder; this.authManager = authManager;
        this.jwt = jwt; this.refreshTokens = refreshTokens;
    }

    @Transactional
    public AuthResponse register(AuthRequest r) {
        if (users.existsByUsername(r.username())) throw new IllegalStateException("Username is already taken");
        AppUser u = users.save(new AppUser(r.username(), encoder.encode(r.password()), "USER"));
        return tokens(u);
    }

    @Transactional
    public AuthResponse login(AuthRequest r) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(r.username(), r.password()));
        return tokens(users.findByUsername(r.username()).orElseThrow());
    }

    // noRollbackFor: the "token reuse" revocation must be saved even though we then throw
    @Transactional(noRollbackFor = BadCredentialsException.class)
    public AuthResponse refresh(String rawRefreshToken) {
        AppUser u = refreshTokens.consume(rawRefreshToken);
        if (!u.isEnabled()) throw new DisabledException("This account is disabled");
        return tokens(u);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokens.revoke(rawRefreshToken);
    }

    private AuthResponse tokens(AppUser u) {
        return new AuthResponse(jwt.generate(u.getUsername(), u.getRole()), refreshTokens.issue(u), u.getUsername(), u.getRole());
    }
}

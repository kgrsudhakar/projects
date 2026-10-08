package com.example.books.service;

import com.example.books.dto.Dtos.*;
import com.example.books.entity.AppUser;
import com.example.books.exception.ResourceNotFoundException;
import com.example.books.repository.UserRepository;
import com.example.books.security.RefreshTokenService;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final RefreshTokenService refreshTokens;

    public UserService(UserRepository users, PasswordEncoder encoder, RefreshTokenService refreshTokens) {
        this.users = users; this.encoder = encoder; this.refreshTokens = refreshTokens;
    }

    public List<UserResponse> list() {
        return users.findAll(Sort.by("username")).stream().map(UserResponse::from).toList();
    }

    public UserResponse me(String username) {
        return UserResponse.from(users.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Transactional
    public UserResponse setRole(Long id, String role, String actor) {
        AppUser u = find(id);
        guardSelf(u, actor, "change the role of");
        u.setRole(role);
        refreshTokens.revokeAll(u); // forces a fresh login so the new role takes effect
        return UserResponse.from(u);
    }

    @Transactional
    public UserResponse setEnabled(Long id, boolean enabled, String actor) {
        AppUser u = find(id);
        guardSelf(u, actor, "disable");
        u.setEnabled(enabled);
        if (!enabled) refreshTokens.revokeAll(u);
        return UserResponse.from(u);
    }

    @Transactional
    public void delete(Long id, String actor) {
        AppUser u = find(id);
        guardSelf(u, actor, "delete");
        refreshTokens.deleteAll(u);
        users.delete(u);
    }

    @Transactional
    public void changePassword(String username, PasswordChangeRequest r) {
        AppUser u = users.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!encoder.matches(r.currentPassword(), u.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        u.setPassword(encoder.encode(r.newPassword()));
        refreshTokens.revokeAll(u); // sign out everywhere
    }

    private AppUser find(Long id) {
        return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User " + id + " not found"));
    }

    private void guardSelf(AppUser target, String actor, String action) {
        if (target.getUsername().equals(actor)) {
            throw new IllegalStateException("You cannot " + action + " your own account");
        }
    }
}

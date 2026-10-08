package com.example.books.controller;

import com.example.books.dto.Dtos.*;
import com.example.books.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService service;

    public UserController(UserService service) { this.service = service; }

    // ----- the logged-in user -----

    @GetMapping("/api/users/me")
    public UserResponse me(Authentication auth) { return service.me(auth.getName()); }

    @PostMapping("/api/users/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(Authentication auth, @Valid @RequestBody PasswordChangeRequest r) {
        service.changePassword(auth.getName(), r);
    }

    // ----- user management (ADMIN only) -----

    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> list() { return service.list(); }

    @PutMapping("/api/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse setRole(@PathVariable Long id, @Valid @RequestBody RoleRequest r, Authentication auth) {
        return service.setRole(id, r.role(), auth.getName());
    }

    @PutMapping("/api/admin/users/{id}/enabled")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse setEnabled(@PathVariable Long id, @RequestBody EnabledRequest r, Authentication auth) {
        return service.setEnabled(id, r.enabled(), auth.getName());
    }

    @DeleteMapping("/api/admin/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id, Authentication auth) { service.delete(id, auth.getName()); }
}

package com.example.books.controller;

import com.example.books.dto.Dtos.*;
import com.example.books.service.AuthorService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {
    private final AuthorService service;

    public AuthorController(AuthorService service) { this.service = service; }

    @GetMapping
    public List<AuthorResponse> list() { return service.list(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public AuthorResponse create(@Valid @RequestBody AuthorRequest request) { return service.create(request); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { service.delete(id); }
}

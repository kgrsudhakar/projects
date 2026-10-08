package com.example.books.controller;

import com.example.books.dto.Dtos.*;
import com.example.books.service.BookService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.time.Duration;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService service;

    public BookController(BookService service) { this.service = service; }

    @GetMapping
    public PageResponse<BookResponse> list(@RequestParam(defaultValue = "") String q,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "8") int size,
                                           @RequestParam(defaultValue = "title") String sort,
                                           @RequestParam(defaultValue = "asc") String dir) {
        return service.search(q, page, size, sort, dir);
    }

    @GetMapping("/stats")
    public Stats stats() { return service.stats(); }

    @GetMapping("/{id}")
    public BookResponse get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public BookResponse create(@Valid @RequestBody BookRequest request) { return service.create(request); }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public BookResponse update(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { service.delete(id); }

    // ----- cover images -----

    @GetMapping("/{id}/cover")
    public ResponseEntity<Resource> cover(@PathVariable Long id) {
        BookService.Cover c = service.cover(id);
        return ResponseEntity.ok()
            .contentType(c.type())
            .cacheControl(CacheControl.maxAge(Duration.ofDays(1)).cachePublic())
            .body(c.resource());
    }

    @PostMapping(value = "/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public BookResponse uploadCover(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        return service.setCover(id, file);
    }

    @DeleteMapping("/{id}/cover")
    @PreAuthorize("isAuthenticated()")
    public BookResponse removeCover(@PathVariable Long id) { return service.removeCover(id); }
}

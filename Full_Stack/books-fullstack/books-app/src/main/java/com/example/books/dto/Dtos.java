package com.example.books.dto;

import com.example.books.entity.AppUser;
import com.example.books.entity.Author;
import com.example.books.entity.Book;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;

public final class Dtos {
    private Dtos() {}

    // ----- books -----
    public record BookRequest(
        @NotBlank @Size(max = 200) String title,
        @Pattern(regexp = "^[0-9-]{10,17}$", message = "ISBN must be 10-17 digits (hyphens allowed)") String isbn,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotNull @Min(1000) @Max(2100) Integer publishedYear,
        @NotNull Long authorId,
        @Size(max = 2000) String description) {}

    public record BookResponse(Long id, String title, String isbn, BigDecimal price, Integer publishedYear,
                               Long authorId, String authorName, String description, String coverUrl, Instant createdAt) {
        public static BookResponse from(Book b) {
            // the file name in the query string changes on every upload, so browsers never show a stale cover
            String cover = b.getCoverFile() == null ? null : "/api/books/" + b.getId() + "/cover?v=" + b.getCoverFile();
            return new BookResponse(b.getId(), b.getTitle(), b.getIsbn(), b.getPrice(), b.getPublishedYear(),
                b.getAuthor().getId(), b.getAuthor().getName(), b.getDescription(), cover, b.getCreatedAt());
        }
    }

    // ----- authors -----
    public record AuthorRequest(@NotBlank @Size(max = 100) String name) {}

    public record AuthorResponse(Long id, String name) {
        public static AuthorResponse from(Author a) { return new AuthorResponse(a.getId(), a.getName()); }
    }

    // ----- auth and users -----
    public record AuthRequest(
        @NotBlank @Size(min = 3, max = 30) String username,
        @NotBlank @Size(min = 6, max = 100) String password) {}

    public record RefreshRequest(@NotBlank String refreshToken) {}

    public record AuthResponse(String accessToken, String refreshToken, String username, String role) {}

    public record UserResponse(Long id, String username, String role, boolean enabled, Instant createdAt) {
        public static UserResponse from(AppUser u) {
            return new UserResponse(u.getId(), u.getUsername(), u.getRole(), u.isEnabled(), u.getCreatedAt());
        }
    }

    public record RoleRequest(@NotBlank @Pattern(regexp = "USER|ADMIN", message = "Role must be USER or ADMIN") String role) {}

    public record EnabledRequest(boolean enabled) {}

    public record PasswordChangeRequest(
        @NotBlank String currentPassword,
        @NotBlank @Size(min = 6, max = 100) String newPassword) {}

    // ----- misc -----
    public record Stats(long totalBooks, long totalAuthors, Double averagePrice) {}

    public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {
        public static <T> PageResponse<T> of(Page<T> p) {
            return new PageResponse<>(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
        }
    }
}

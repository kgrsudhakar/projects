package com.example.books.service;

import com.example.books.dto.Dtos.*;
import com.example.books.entity.Book;
import com.example.books.exception.ResourceNotFoundException;
import com.example.books.repository.AuthorRepository;
import com.example.books.repository.BookRepository;
import java.io.IOException;
import java.util.Set;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional(readOnly = true)
public class BookService {
    private static final Set<String> SORTABLE = Set.of("title", "price", "publishedYear", "createdAt");

    public record Cover(Resource resource, MediaType type) {}

    private final BookRepository books;
    private final AuthorRepository authors;
    private final CoverStorageService covers;

    public BookService(BookRepository books, AuthorRepository authors, CoverStorageService covers) {
        this.books = books; this.authors = authors; this.covers = covers;
    }

    public PageResponse<BookResponse> search(String q, int page, int size, String sort, String dir) {
        Sort.Direction d = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String field = SORTABLE.contains(sort) ? sort : "title";
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by(d, field));
        return PageResponse.of(books.search(q == null ? "" : q.trim(), pageable).map(BookResponse::from));
    }

    public BookResponse get(Long id) {
        return BookResponse.from(find(id));
    }

    @Cacheable("stats")
    public Stats stats() {
        return new Stats(books.count(), authors.count(), books.averagePrice());
    }

    @Transactional
    @CacheEvict(value = "stats", allEntries = true)
    public BookResponse create(BookRequest r) {
        if (r.isbn() != null && books.existsByIsbn(r.isbn())) {
            throw new IllegalStateException("A book with this ISBN already exists");
        }
        Book b = new Book();
        apply(b, r);
        return BookResponse.from(books.save(b));
    }

    @Transactional
    @CacheEvict(value = "stats", allEntries = true)
    public BookResponse update(Long id, BookRequest r) {
        Book b = find(id);
        if (r.isbn() != null && !r.isbn().equals(b.getIsbn()) && books.existsByIsbn(r.isbn())) {
            throw new IllegalStateException("A book with this ISBN already exists");
        }
        apply(b, r);
        return BookResponse.from(b);
    }

    @Transactional
    @CacheEvict(value = "stats", allEntries = true)
    public void delete(Long id) {
        Book b = find(id);
        covers.delete(b.getCoverFile());
        books.delete(b);
    }

    // ----- cover images -----

    public Cover cover(Long id) {
        Book b = find(id);
        if (b.getCoverFile() == null) throw new ResourceNotFoundException("This book has no cover");
        return new Cover(covers.load(b.getCoverFile()), CoverStorageService.mediaType(b.getCoverFile()));
    }

    @Transactional
    public BookResponse setCover(Long id, MultipartFile file) throws IOException {
        Book b = find(id);
        String newName = covers.store(file);
        covers.delete(b.getCoverFile()); // remove the previous image
        b.setCoverFile(newName);
        return BookResponse.from(b);
    }

    @Transactional
    public BookResponse removeCover(Long id) {
        Book b = find(id);
        covers.delete(b.getCoverFile());
        b.setCoverFile(null);
        return BookResponse.from(b);
    }

    private Book find(Long id) {
        return books.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book " + id + " not found"));
    }

    private void apply(Book b, BookRequest r) {
        b.setTitle(r.title().trim());
        b.setIsbn(r.isbn());
        b.setPrice(r.price());
        b.setPublishedYear(r.publishedYear());
        b.setDescription(r.description() == null || r.description().isBlank() ? null : r.description().trim());
        b.setAuthor(authors.findById(r.authorId())
            .orElseThrow(() -> new ResourceNotFoundException("Author " + r.authorId() + " not found")));
    }
}

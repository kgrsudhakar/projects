package com.example.books.service;

import com.example.books.dto.Dtos.*;
import com.example.books.entity.Author;
import com.example.books.exception.ResourceNotFoundException;
import com.example.books.repository.AuthorRepository;
import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthorService {
    private final AuthorRepository authors;

    public AuthorService(AuthorRepository authors) { this.authors = authors; }

    @Cacheable("authors")
    public List<AuthorResponse> list() {
        return authors.findAll(Sort.by("name")).stream().map(AuthorResponse::from).toList();
    }

    @Transactional
    @CacheEvict(value = {"authors", "stats"}, allEntries = true)
    public AuthorResponse create(AuthorRequest r) {
        String name = r.name().trim();
        if (authors.existsByName(name)) throw new IllegalStateException("This author already exists");
        return AuthorResponse.from(authors.save(new Author(name)));
    }

    @Transactional
    @CacheEvict(value = {"authors", "stats"}, allEntries = true)
    public void delete(Long id) {
        Author a = authors.findById(id).orElseThrow(() -> new ResourceNotFoundException("Author " + id + " not found"));
        authors.delete(a);
    }
}

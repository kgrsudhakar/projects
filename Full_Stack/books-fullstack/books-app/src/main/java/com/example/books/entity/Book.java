package com.example.books.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "books")
@EntityListeners(AuditingEntityListener.class)
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true)
    private String isbn;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private Integer publishedYear;

    @Column(length = 2000)
    private String description;

    /** File name of the uploaded cover inside the upload directory (null = no cover). */
    private String coverFile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    private Author author;

    @CreatedDate @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Book() {}
    public Book(String title, String isbn, BigDecimal price, Integer publishedYear, Author author) {
        this.title = title; this.isbn = isbn; this.price = price; this.publishedYear = publishedYear; this.author = author;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCoverFile() { return coverFile; }
    public void setCoverFile(String coverFile) { this.coverFile = coverFile; }
    public Author getAuthor() { return author; }
    public void setAuthor(Author author) { this.author = author; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

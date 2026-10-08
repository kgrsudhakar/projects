package com.example.books.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "authors")
public class Author {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // Deleting an author removes their books too
    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
    private List<Book> books = new ArrayList<>();

    public Author() {}
    public Author(String name) { this.name = name; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

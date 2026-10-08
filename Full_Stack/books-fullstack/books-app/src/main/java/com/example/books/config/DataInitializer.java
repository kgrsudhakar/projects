package com.example.books.config;

import com.example.books.entity.AppUser;
import com.example.books.entity.Author;
import com.example.books.entity.Book;
import com.example.books.repository.AuthorRepository;
import com.example.books.repository.BookRepository;
import com.example.books.repository.UserRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Seeds demo users and books on first start. */
@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository users;
    private final AuthorRepository authors;
    private final BookRepository books;
    private final PasswordEncoder encoder;

    public DataInitializer(UserRepository users, AuthorRepository authors, BookRepository books, PasswordEncoder encoder) {
        this.users = users; this.authors = authors; this.books = books; this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() == 0) {
            users.save(new AppUser("admin", encoder.encode("admin123"), "ADMIN"));
            users.save(new AppUser("user", encoder.encode("user123"), "USER"));
        }
        if (authors.count() == 0) {
            Author orwell = authors.save(new Author("George Orwell"));
            Author austen = authors.save(new Author("Jane Austen"));
            Author tolkien = authors.save(new Author("J.R.R. Tolkien"));
            Author le = authors.save(new Author("Ursula K. Le Guin"));
            books.save(new Book("1984", "9780451524935", new BigDecimal("9.99"), 1949, orwell));
            books.save(new Book("Animal Farm", "9780451526342", new BigDecimal("7.99"), 1945, orwell));
            books.save(new Book("Pride and Prejudice", "9780141439518", new BigDecimal("8.49"), 1813, austen));
            books.save(new Book("Emma", "9780141439587", new BigDecimal("8.99"), 1815, austen));
            books.save(new Book("The Hobbit", "9780547928227", new BigDecimal("12.99"), 1937, tolkien));
            books.save(new Book("The Fellowship of the Ring", "9780547928210", new BigDecimal("14.99"), 1954, tolkien));
            books.save(new Book("A Wizard of Earthsea", "9780547773742", new BigDecimal("10.99"), 1968, le));
            books.save(new Book("The Left Hand of Darkness", "9780441478125", new BigDecimal("11.49"), 1969, le));
            books.save(new Book("The Dispossessed", "9780061054884", new BigDecimal("12.49"), 1974, le));
        }
    }
}

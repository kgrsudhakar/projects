package com.example.books.repository;

import com.example.books.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    // EntityGraph loads the author in the same query (avoids the N+1 problem)
    @EntityGraph(attributePaths = "author")
    @Query("""
           select b from Book b
           where lower(b.title) like lower(concat('%', :q, '%'))
              or lower(b.author.name) like lower(concat('%', :q, '%'))
           """)
    Page<Book> search(@Param("q") String q, Pageable pageable);

    boolean existsByIsbn(String isbn);

    @Query("select avg(b.price) from Book b")
    Double averagePrice();
}

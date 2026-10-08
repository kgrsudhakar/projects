package com.example.books.config;

import com.example.books.repository.BookRepository;
import com.example.books.repository.RefreshTokenRepository;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private final BookRepository books;
    private final RefreshTokenRepository refreshTokens;

    public ScheduledTasks(BookRepository books, RefreshTokenRepository refreshTokens) {
        this.books = books; this.refreshTokens = refreshTokens;
    }

    @Scheduled(fixedRate = 600_000, initialDelay = 600_000)
    public void logBookCount() {
        log.info("Scheduled report: {} books in the library", books.count());
    }

    /** Removes expired refresh tokens every night at 03:00. */
    @Scheduled(cron = "0 0 3 * * *")
    public void purgeExpiredRefreshTokens() {
        int n = refreshTokens.deleteExpired(Instant.now());
        log.info("Purged {} expired refresh tokens", n);
    }
}

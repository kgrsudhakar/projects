package com.example.books.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Bound from the "app" section of application.yml (externalized configuration). */
@ConfigurationProperties(prefix = "app")
public record AppProperties(String jwtSecret, long jwtExpirationMinutes, long refreshExpirationDays) {}

package com.example.demo.dto;

public record PersonResponse(
        Long id, String name, String email, String phone,
        String position, String department) {}

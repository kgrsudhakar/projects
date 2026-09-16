package com.example.demo.service;

import com.example.demo.dto.PersonResponse;

public interface PersonService {
    PersonResponse getPersonDetails(Long id);
}

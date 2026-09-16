package com.example.demo.service;

import com.example.demo.client.PositionApiClient;
import com.example.demo.dto.PersonResponse;
import com.example.demo.dto.PositionInfo;
import com.example.demo.entity.Person;
import com.example.demo.exception.PersonNotFoundException;
import com.example.demo.repository.PersonRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonServiceImpl implements PersonService {
    private final PersonRepository personRepository;
    private final PositionApiClient positionApiClient;

    public PersonServiceImpl(PersonRepository personRepository,
                             PositionApiClient positionApiClient) {
        this.personRepository = personRepository;
        this.positionApiClient = positionApiClient;
    }

    @Override
    public PersonResponse getPersonDetails(Long id) {
        // 1. Same ID -> database
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new PersonNotFoundException(
                        "Person not found with id: " + id));

        // 2. Same ID -> external API
        PositionInfo position = positionApiClient.getPositionInfo(id);

        // 3. Combine both responses
        return new PersonResponse(
                person.getId(),
                person.getName(),
                person.getEmail(),
                person.getPhone(),
                position.position(),
                position.department()
        );
    }
}

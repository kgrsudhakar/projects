package com.example.employeeservice.service.impl;

import com.example.employeeservice.client.PositionApiClient;
import com.example.employeeservice.dto.EmployeeResponse;
import com.example.employeeservice.dto.PersonalInfoDto;
import com.example.employeeservice.dto.PositionInfoDto;
import com.example.employeeservice.entity.PersonalInfo;
import com.example.employeeservice.exception.ResourceNotFoundException;
import com.example.employeeservice.repository.PersonalInfoRepository;
import com.example.employeeservice.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executor;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final PersonalInfoRepository personalInfoRepository;
    private final PositionApiClient positionApiClient;
    private final Executor employeeTaskExecutor;

    @Override
    public EmployeeResponse getEmployeeDetails(Long employeeId) {
        log.info("Fetching employee details for id={}", employeeId);

        // Fire off both lookups in parallel — same id used for both — instead of
        // calling the DB, waiting, then calling the external API sequentially.
        CompletableFuture<PersonalInfoDto> personalInfoFuture = CompletableFuture.supplyAsync(
                () -> fetchPersonalInfo(employeeId), employeeTaskExecutor);

        CompletableFuture<PositionInfoDto> positionInfoFuture = CompletableFuture.supplyAsync(
                () -> positionApiClient.getPositionInfo(employeeId), employeeTaskExecutor);

        try {
            CompletableFuture.allOf(personalInfoFuture, positionInfoFuture).join();
        } catch (CompletionException ex) {
            // join() wraps the original exception in a CompletionException;
            // unwrap it so GlobalExceptionHandler sees the real exception type
            // (ResourceNotFoundException -> 404, ExternalApiException -> 502, etc.)
            Throwable cause = ex.getCause() != null ? ex.getCause() : ex;
            if (cause instanceof RuntimeException runtimeException) {
                throw runtimeException;
            }
            throw new RuntimeException("Failed to fetch employee details", cause);
        }

        PersonalInfoDto personalInfo = personalInfoFuture.join();
        PositionInfoDto positionInfo = positionInfoFuture.join();

        return EmployeeResponse.builder()
                .id(employeeId)
                .personalInfo(personalInfo)
                .positionInfo(positionInfo)
                .build();
    }

    private PersonalInfoDto fetchPersonalInfo(Long employeeId) {
        PersonalInfo entity = personalInfoRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Personal info not found for employee id: " + employeeId));

        return PersonalInfoDto.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .address(entity.getAddress())
                .build();
    }
}

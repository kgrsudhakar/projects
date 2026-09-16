package com.example.employeeservice.client;

import com.example.employeeservice.dto.PositionInfoDto;
import com.example.employeeservice.exception.ExternalApiException;
import com.example.employeeservice.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class PositionApiClient {

    private final WebClient positionApiWebClient;

    /**
     * Calls GET /positions/{id} on the external system, using the SAME employee id
     * passed to the controller / service. Blocking wrapper is used here so it fits
     * cleanly into a CompletableFuture in the service layer; swap for full-reactive
     * chaining if the rest of the app is reactive.
     */
    public PositionInfoDto getPositionInfo(Long employeeId) {
        try {
            return positionApiWebClient.get()
                    .uri("/positions/{id}", employeeId)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, response -> {
                        if (response.statusCode().value() == 404) {
                            return Mono.error(new ResourceNotFoundException(
                                    "Position info not found for employee id: " + employeeId));
                        }
                        return Mono.error(new ExternalApiException(
                                "Client error calling position API, status: " + response.statusCode()));
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(
                            new ExternalApiException(
                                    "Position API server error, status: " + response.statusCode())))
                    .bodyToMono(PositionInfoDto.class)
                    .block();
        } catch (ResourceNotFoundException | ExternalApiException ex) {
            throw ex;
        } catch (WebClientResponseException ex) {
            log.error("Position API call failed for id {}: {}", employeeId, ex.getMessage());
            throw new ExternalApiException("Position API call failed: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error calling position API for id {}", employeeId, ex);
            throw new ExternalApiException("Unexpected error calling position API", ex);
        }
    }
}

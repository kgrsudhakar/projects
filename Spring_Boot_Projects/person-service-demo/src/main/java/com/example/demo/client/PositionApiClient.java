package com.example.demo.client;

import com.example.demo.dto.PositionInfo;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PositionApiClient {
    private final RestClient restClient;

    public PositionApiClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("http://localhost:8080").build();
    }

    public PositionInfo getPositionInfo(Long id) {
        return restClient.get()
                .uri("/mock-external/position/{id}", id)
                .retrieve()
                .body(PositionInfo.class);
    }
}

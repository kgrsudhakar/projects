package com.example.employeeservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Shape returned by the external Position API.
 * @JsonIgnoreProperties guards against the external API adding fields later
 * that we don't care about, so deserialization doesn't break.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PositionInfoDto {
    private Long employeeId;
    private String title;
    private String department;
    private String level;
    private String reportingManager;
}

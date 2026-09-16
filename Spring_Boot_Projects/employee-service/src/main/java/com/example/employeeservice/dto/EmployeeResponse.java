package com.example.employeeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The final combined payload: personal info (from DB) + position info (from external API),
 * keyed by the same employee id.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private PersonalInfoDto personalInfo;
    private PositionInfoDto positionInfo;
}

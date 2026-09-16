package com.example.employeeservice.service;

import com.example.employeeservice.dto.EmployeeResponse;

public interface EmployeeService {

    /**
     * Given an employee id, fetches personal info (DB) and position info (external API)
     * using that same id, and returns the combined result.
     */
    EmployeeResponse getEmployeeDetails(Long employeeId);
}

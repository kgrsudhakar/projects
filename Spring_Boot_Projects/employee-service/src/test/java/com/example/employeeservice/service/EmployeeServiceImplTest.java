package com.example.employeeservice.service;

import com.example.employeeservice.client.PositionApiClient;
import com.example.employeeservice.dto.EmployeeResponse;
import com.example.employeeservice.dto.PositionInfoDto;
import com.example.employeeservice.entity.PersonalInfo;
import com.example.employeeservice.exception.ResourceNotFoundException;
import com.example.employeeservice.repository.PersonalInfoRepository;
import com.example.employeeservice.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.concurrent.Executor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

    @Mock
    private PersonalInfoRepository personalInfoRepository;

    @Mock
    private PositionApiClient positionApiClient;

    // Run synchronously in tests so results are deterministic
    private final Executor directExecutor = Runnable::run;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @Test
    void returnsCombinedResponse_whenBothCallsSucceed() {
        employeeService = new EmployeeServiceImpl(personalInfoRepository, positionApiClient, directExecutor);

        PersonalInfo entity = new PersonalInfo(1L, "Asha", "Rao", "asha.rao@example.com", "9876543210", "Hyderabad");
        when(personalInfoRepository.findById(1L)).thenReturn(Optional.of(entity));

        PositionInfoDto position = PositionInfoDto.builder()
                .employeeId(1L).title("Software Engineer").department("Engineering")
                .level("L3").reportingManager("Priya Nair").build();
        when(positionApiClient.getPositionInfo(1L)).thenReturn(position);

        EmployeeResponse response = employeeService.getEmployeeDetails(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getPersonalInfo().getFirstName()).isEqualTo("Asha");
        assertThat(response.getPositionInfo().getTitle()).isEqualTo("Software Engineer");
    }

    @Test
    void throwsResourceNotFound_whenPersonalInfoMissing() {
        employeeService = new EmployeeServiceImpl(personalInfoRepository, positionApiClient, directExecutor);

        when(personalInfoRepository.findById(99L)).thenReturn(Optional.empty());
        when(positionApiClient.getPositionInfo(99L)).thenReturn(
                PositionInfoDto.builder().employeeId(99L).title("N/A").build());

        assertThatThrownBy(() -> employeeService.getEmployeeDetails(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }
}

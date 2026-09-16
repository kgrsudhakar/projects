package com.example.employeeservice.repository;

import com.example.employeeservice.entity.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Standard Spring Data JPA repository.
 * findById(id) is all the service layer needs to fetch personal info by employee id.
 */
@Repository
public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {
}

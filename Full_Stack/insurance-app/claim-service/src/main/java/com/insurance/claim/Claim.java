package com.insurance.claim;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity @Data
public class Claim {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotNull private Long policyId;
    @NotBlank private String description;
    @NotNull @Positive private BigDecimal amount;
    private String status = "SUBMITTED";   // SUBMITTED, APPROVED, REJECTED
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.insurance.policy;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Entity @Data
public class Policy {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank private String holderName;
    @NotBlank private String type;          // HEALTH, AUTO, HOME, LIFE
    @NotNull @Positive private BigDecimal premium;
    @NotNull private LocalDate startDate;
    @NotNull private LocalDate endDate;
    private String status = "ACTIVE";
}

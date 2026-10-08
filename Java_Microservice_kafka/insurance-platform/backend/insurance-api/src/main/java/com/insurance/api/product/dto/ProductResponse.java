package com.insurance.api.product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(

        Long id,

        String name,

        String type,

        String description,

        BigDecimal coverageAmount,

        BigDecimal premium,

        Integer duration,

        Boolean active,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}
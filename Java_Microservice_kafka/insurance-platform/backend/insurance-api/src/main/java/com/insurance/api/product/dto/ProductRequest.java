package com.insurance.api.product.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductRequest(

        @NotBlank(message = "Product name is required")
        String name,

        @NotBlank(message = "Product type is required")
        String type,

        String description,

        @NotNull(message = "Coverage amount is required")
        @Positive(message = "Coverage must be greater than zero")
        BigDecimal coverageAmount,

        @NotNull(message = "Premium is required")
        @Positive(message = "Premium must be greater than zero")
        BigDecimal premium,

        @NotNull(message = "Duration is required")
        @Positive(message = "Duration must be greater than zero")
        Integer duration,

        Boolean active
) {
}
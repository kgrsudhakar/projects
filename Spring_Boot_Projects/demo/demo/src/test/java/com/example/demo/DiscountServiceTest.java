package com.example.demo;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DiscountServiceTest {

    private final DiscountService service = new DiscountService();

    @Test
    void shouldApplyDiscountCorrectly() {
        double result = service.applyDiscount(200.0, 10);
        assertEquals(180.0, result);
    }

    @Test
    void shouldThrowExceptionForInvalidPercent() {
        assertThrows(IllegalArgumentException.class,
                () -> service.applyDiscount(200.0, 150));
    }
}
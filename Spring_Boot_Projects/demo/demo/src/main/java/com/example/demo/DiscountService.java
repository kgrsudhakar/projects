package com.example.demo;

import org.springframework.stereotype.Service;

@Service
public class DiscountService {
    public double applyDiscount(double price, double percent) {
        if (percent < 0 || percent > 100) {
            throw new IllegalArgumentException("Invalid percent");
        }
        return price - (price * percent / 100);
    }
}

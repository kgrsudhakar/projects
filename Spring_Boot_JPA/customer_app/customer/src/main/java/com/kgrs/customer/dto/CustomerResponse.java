package com.kgrs.customer.dto;
import lombok.*;

@Data
@Builder
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
}
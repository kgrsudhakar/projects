package com.insurance.api.product.controller;

import com.insurance.api.product.dto.ProductRequest;
import com.insurance.api.product.dto.ProductResponse;
import com.insurance.api.product.service.InsuranceProductService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class InsuranceProductController {

    private final InsuranceProductService service;

    @PostMapping
    public ProductResponse create(
            @Valid @RequestBody ProductRequest request) {

        return service.create(request);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(
            @PathVariable Long id) {

        return service.getById(id);
    }

    @GetMapping
    public Page<ProductResponse> getAll(

            @RequestParam(required = false)
            String name,

            @RequestParam(required = false)
            String type,

            @RequestParam(required = false)
            Boolean active,

            @PageableDefault(
                    size = 10,
                    sort = "id"
            )
            Pageable pageable) {

        return service.getAll(
                name,
                type,
                active,
                pageable
        );
    }

    @PutMapping("/{id}")
    public ProductResponse update(

            @PathVariable Long id,

            @Valid @RequestBody ProductRequest request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.delete(id);
    }
}
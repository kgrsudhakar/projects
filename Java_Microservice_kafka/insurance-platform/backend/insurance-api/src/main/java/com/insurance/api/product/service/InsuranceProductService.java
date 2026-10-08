package com.insurance.api.product.service;

import com.insurance.api.product.dto.ProductRequest;
import com.insurance.api.product.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InsuranceProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse getById(Long id);

    Page<ProductResponse> getAll(
            String name,
            String type,
            Boolean active,
            Pageable pageable
    );

    ProductResponse update(
            Long id,
            ProductRequest request
    );

    void delete(Long id);
}
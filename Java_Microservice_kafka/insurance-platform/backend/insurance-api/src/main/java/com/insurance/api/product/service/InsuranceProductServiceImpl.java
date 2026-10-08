package com.insurance.api.product.service;

import com.insurance.api.common.exception.ResourceNotFoundException;
import com.insurance.api.product.dto.ProductRequest;
import com.insurance.api.product.dto.ProductResponse;
import com.insurance.api.product.entity.InsuranceProduct;
import com.insurance.api.product.repository.InsuranceProductRepository;
import com.insurance.api.product.specification.InsuranceProductSpecification;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsuranceProductServiceImpl
        implements InsuranceProductService {

    private final InsuranceProductRepository repository;

    @Override
    public ProductResponse create(ProductRequest request) {

        InsuranceProduct product = InsuranceProduct.builder()
                .name(request.name())
                .type(request.type())
                .description(request.description())
                .coverageAmount(request.coverageAmount())
                .premium(request.premium())
                .duration(request.duration())
                .active(
                        request.active() == null
                                ? true
                                : request.active()
                )
                .build();

        InsuranceProduct saved = repository.save(product);

        return mapToResponse(saved);
    }

    @Override
    public ProductResponse getById(Long id) {

        InsuranceProduct product =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found: " + id
                                )
                        );

        return mapToResponse(product);
    }

    @Override
    public Page<ProductResponse> getAll(
            String name,
            String type,
            Boolean active,
            Pageable pageable) {

        Specification<InsuranceProduct> specification =
                Specification.allOf(
                        InsuranceProductSpecification.hasName(name),
                        InsuranceProductSpecification.hasType(type),
                        InsuranceProductSpecification.hasActive(active)
                );

        Page<InsuranceProduct> products =
                repository.findAll(
                        specification,
                        pageable
                );

        return products.map(this::mapToResponse);
    }

    @Override
    public ProductResponse update(
            Long id,
            ProductRequest request) {

        InsuranceProduct product =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found: " + id
                                )
                        );

        product.setName(request.name());
        product.setType(request.type());
        product.setDescription(request.description());
        product.setCoverageAmount(request.coverageAmount());
        product.setPremium(request.premium());
        product.setDuration(request.duration());

        if (request.active() != null) {
            product.setActive(request.active());
        }

        InsuranceProduct updated =
                repository.save(product);

        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {

        InsuranceProduct product =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found: " + id
                                )
                        );

        repository.delete(product);
    }

    private ProductResponse mapToResponse(
            InsuranceProduct product) {

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getType(),
                product.getDescription(),
                product.getCoverageAmount(),
                product.getPremium(),
                product.getDuration(),
                product.getActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
package com.insurance.api.product.specification;

import com.insurance.api.product.entity.InsuranceProduct;
import org.springframework.data.jpa.domain.Specification;

public final class InsuranceProductSpecification {

    private InsuranceProductSpecification() {
    }

    public static Specification<InsuranceProduct> hasName(String name) {

        return (root, query, criteriaBuilder) ->
                name == null || name.isBlank()
                        ? null
                        : criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + name.toLowerCase() + "%"
                        );
    }

    public static Specification<InsuranceProduct> hasType(String type) {

        return (root, query, criteriaBuilder) ->
                type == null || type.isBlank()
                        ? null
                        : criteriaBuilder.equal(
                                criteriaBuilder.lower(root.get("type")),
                                type.toLowerCase()
                        );
    }

    public static Specification<InsuranceProduct> hasActive(Boolean active) {

        return (root, query, criteriaBuilder) ->
                active == null
                        ? null
                        : criteriaBuilder.equal(
                                root.get("active"),
                                active
                        );
    }
}
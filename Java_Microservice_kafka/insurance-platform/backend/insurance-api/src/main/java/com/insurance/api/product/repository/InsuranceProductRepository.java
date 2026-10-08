package com.insurance.api.product.repository;

import com.insurance.api.product.entity.InsuranceProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InsuranceProductRepository
        extends JpaRepository<InsuranceProduct, Long>,
                JpaSpecificationExecutor<InsuranceProduct> {
}
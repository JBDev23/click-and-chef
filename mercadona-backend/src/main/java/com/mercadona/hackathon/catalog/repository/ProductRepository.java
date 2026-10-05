package com.mercadona.hackathon.catalog.repository;

import com.mercadona.hackathon.catalog.entity.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
  Optional<Product> findBySourceId(Long sourceId);

  List<Product> findAllByDrinkEligibleTrueAndActiveTrueOrderByNameAsc();

  List<Product> findAllByDessertEligibleTrueAndActiveTrueOrderByNameAsc();
}

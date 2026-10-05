package com.mercadona.hackathon.catalog.service;

import com.mercadona.hackathon.catalog.dto.ComplementResponse;
import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.catalog.entity.ProductRole;
import com.mercadona.hackathon.catalog.repository.ProductRepository;
import com.mercadona.hackathon.common.util.Money;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductCatalogService {
  private final ProductRepository products;

  public ProductCatalogService(ProductRepository products) {
    this.products = products;
  }

  @Transactional(readOnly = true)
  public List<ComplementResponse> list(ProductRole role) {
    List<Product> selected =
        role == ProductRole.DRINK
            ? products.findAllByDrinkEligibleTrueAndActiveTrueOrderByNameAsc()
            : products.findAllByDessertEligibleTrueAndActiveTrueOrderByNameAsc();
    return selected.stream()
        .filter(product -> product.isEligible(role))
        .map(
            product ->
                new ComplementResponse(
                    product.getId(),
                    product.getSourceId(),
                    product.getName(),
                    role,
                    product.getServingFormat(),
                    Money.format(product.getServingPrice()),
                    "EUR",
                    product.getMainImageUrl()))
        .toList();
  }
}

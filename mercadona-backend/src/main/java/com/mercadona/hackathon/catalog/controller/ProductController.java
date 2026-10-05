package com.mercadona.hackathon.catalog.controller;

import com.mercadona.hackathon.catalog.dto.ComplementResponse;
import com.mercadona.hackathon.catalog.entity.ProductRole;
import com.mercadona.hackathon.catalog.service.ProductCatalogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Complementos")
public class ProductController {
  private final ProductCatalogService catalog;

  public ProductController(ProductCatalogService catalog) {
    this.catalog = catalog;
  }

  @GetMapping
  public List<ComplementResponse> list(@RequestParam ProductRole role) {
    return catalog.list(role);
  }
}

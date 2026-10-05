package com.mercadona.hackathon.catalog.dto;

import com.mercadona.hackathon.catalog.entity.ProductRole;

public record ComplementResponse(
    Long id,
    Long sourceId,
    String name,
    ProductRole role,
    String servingFormat,
    String price,
    String currency,
    String imageUrl) {}

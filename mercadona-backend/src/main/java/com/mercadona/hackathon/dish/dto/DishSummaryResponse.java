package com.mercadona.hackathon.dish.dto;

public record DishSummaryResponse(
    Long id,
    String slug,
    String name,
    String description,
    String imageUrl,
    String basePrice,
    String currency) {}

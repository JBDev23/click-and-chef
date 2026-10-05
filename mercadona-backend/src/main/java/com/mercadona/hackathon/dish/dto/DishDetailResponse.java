package com.mercadona.hackathon.dish.dto;

import java.util.List;

public record DishDetailResponse(
    Long id,
    String slug,
    String name,
    String description,
    String imageUrl,
    String basePrice,
    String currency,
    List<IngredientResponse> ingredients) {}

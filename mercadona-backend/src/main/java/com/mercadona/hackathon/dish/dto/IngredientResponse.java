package com.mercadona.hackathon.dish.dto;

import com.mercadona.hackathon.dish.entity.MeasurementUnit;

public record IngredientResponse(
    Long dishIngredientId,
    Long productId,
    Long sourceId,
    String name,
    boolean available,
    int defaultQuantity,
    int minQuantity,
    int maxQuantity,
    int stepQuantity,
    MeasurementUnit unit,
    String extraStepPrice) {}

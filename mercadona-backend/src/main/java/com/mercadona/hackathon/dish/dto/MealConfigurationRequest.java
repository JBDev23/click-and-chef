package com.mercadona.hackathon.dish.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record MealConfigurationRequest(
    @Size(max = 100) List<@NotNull @Valid IngredientSelectionRequest> ingredients,
    @Positive Long drinkProductId,
    @Positive Long dessertProductId,
    @NotNull @Min(1) @Max(99) Integer quantity) {
  public record IngredientSelectionRequest(
      @NotNull @Positive Long dishIngredientId, @NotNull @Min(0) Integer quantity) {}
}

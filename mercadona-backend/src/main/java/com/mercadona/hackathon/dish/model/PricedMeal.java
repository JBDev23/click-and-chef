package com.mercadona.hackathon.dish.model;

import java.math.BigDecimal;
import java.util.List;

public record PricedMeal(
    ValidatedMeal configuration,
    List<PricedIngredient> ingredients,
    BigDecimal basePrice,
    BigDecimal ingredientExtras,
    BigDecimal drinkPrice,
    BigDecimal dessertPrice,
    BigDecimal unitPrice,
    BigDecimal total) {
  public record PricedIngredient(
      ValidatedMeal.SelectedIngredient selection, BigDecimal extraPrice) {}
}

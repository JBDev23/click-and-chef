package com.mercadona.hackathon.dish.dto;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.common.util.Money;
import com.mercadona.hackathon.dish.entity.MeasurementUnit;
import com.mercadona.hackathon.dish.model.PricedMeal;
import java.util.List;

public record MealPriceResponse(
    String currency,
    String basePrice,
    String ingredientExtras,
    String drinkPrice,
    String dessertPrice,
    String unitPrice,
    int quantity,
    String total,
    List<IngredientPriceResponse> ingredients,
    AddonPriceResponse drink,
    AddonPriceResponse dessert) {
  public static MealPriceResponse from(PricedMeal meal) {
    return new MealPriceResponse(
        "EUR",
        Money.format(meal.basePrice()),
        Money.format(meal.ingredientExtras()),
        Money.format(meal.drinkPrice()),
        Money.format(meal.dessertPrice()),
        Money.format(meal.unitPrice()),
        meal.configuration().quantity(),
        Money.format(meal.total()),
        meal.ingredients().stream()
            .map(
                priced -> {
                  var selection = priced.selection();
                  var recipe = selection.recipe();
                  return new IngredientPriceResponse(
                      recipe.getId(),
                      recipe.getProduct().getId(),
                      recipe.getProduct().getName(),
                      recipe.getDefaultQuantity(),
                      selection.quantity(),
                      recipe.getUnit(),
                      Money.format(priced.extraPrice()));
                })
            .toList(),
        addon(meal.configuration().drink()),
        addon(meal.configuration().dessert()));
  }

  private static AddonPriceResponse addon(Product product) {
    return product == null
        ? null
        : new AddonPriceResponse(
            product.getId(),
            product.getName(),
            product.getServingFormat(),
            Money.format(product.getServingPrice()));
  }

  public record IngredientPriceResponse(
      Long dishIngredientId,
      Long productId,
      String name,
      int defaultQuantity,
      int selectedQuantity,
      MeasurementUnit unit,
      String extraPrice) {}

  public record AddonPriceResponse(
      Long productId, String name, String servingFormat, String price) {}
}

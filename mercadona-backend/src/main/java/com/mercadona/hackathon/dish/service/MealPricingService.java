package com.mercadona.hackathon.dish.service;

import com.mercadona.hackathon.common.util.Money;
import com.mercadona.hackathon.dish.entity.DishIngredient;
import com.mercadona.hackathon.dish.model.PricedMeal;
import com.mercadona.hackathon.dish.model.ValidatedMeal;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MealPricingService {
  public PricedMeal calculate(ValidatedMeal meal) {
    List<PricedMeal.PricedIngredient> ingredients =
        meal.ingredients().stream()
            .map(
                selection -> {
                  DishIngredient recipe = selection.recipe();
                  int extraSteps =
                      Math.max(0, selection.quantity() - recipe.getDefaultQuantity())
                          / recipe.getStepQuantity();
                  return new PricedMeal.PricedIngredient(
                      selection,
                      Money.round(
                          recipe.getExtraStepPrice().multiply(BigDecimal.valueOf(extraSteps))));
                })
            .toList();
    BigDecimal extras =
        ingredients.stream()
            .map(PricedMeal.PricedIngredient::extraPrice)
            .reduce(Money.ZERO, BigDecimal::add);
    BigDecimal drink = meal.drink() == null ? Money.ZERO : meal.drink().getServingPrice();
    BigDecimal dessert = meal.dessert() == null ? Money.ZERO : meal.dessert().getServingPrice();
    BigDecimal base = meal.dish().getBasePrice();
    BigDecimal unit = Money.round(base.add(extras).add(drink).add(dessert));
    return new PricedMeal(
        meal,
        ingredients,
        base,
        extras,
        drink,
        dessert,
        unit,
        Money.round(unit.multiply(BigDecimal.valueOf(meal.quantity()))));
  }
}

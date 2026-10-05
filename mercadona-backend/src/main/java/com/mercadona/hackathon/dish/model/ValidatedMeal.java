package com.mercadona.hackathon.dish.model;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.dish.entity.Dish;
import com.mercadona.hackathon.dish.entity.DishIngredient;
import java.util.List;

public record ValidatedMeal(
    Dish dish, List<SelectedIngredient> ingredients, Product drink, Product dessert, int quantity) {
  public record SelectedIngredient(DishIngredient recipe, int quantity) {}
}

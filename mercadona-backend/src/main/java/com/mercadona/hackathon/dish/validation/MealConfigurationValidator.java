package com.mercadona.hackathon.dish.validation;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.catalog.entity.ProductRole;
import com.mercadona.hackathon.catalog.repository.ProductRepository;
import com.mercadona.hackathon.common.exception.ApiException;
import com.mercadona.hackathon.dish.dto.MealConfigurationRequest;
import com.mercadona.hackathon.dish.entity.Dish;
import com.mercadona.hackathon.dish.entity.DishIngredient;
import com.mercadona.hackathon.dish.model.ValidatedMeal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class MealConfigurationValidator {
  private final ProductRepository products;

  public MealConfigurationValidator(ProductRepository products) {
    this.products = products;
  }

  public ValidatedMeal validate(Dish dish, MealConfigurationRequest request) {
    if (request == null
        || request.quantity() == null
        || request.quantity() < 1
        || request.quantity() > 99)
      throw ApiException.invalid("El número de raciones debe estar entre 1 y 99.");
    Map<Long, Integer> quantities = new HashMap<>();
    if (request.ingredients() != null) {
      for (var selection : request.ingredients()) {
        if (selection == null
            || selection.dishIngredientId() == null
            || selection.quantity() == null)
          throw ApiException.invalid("Cada ingrediente necesita identificador y cantidad.");
        if (quantities.putIfAbsent(selection.dishIngredientId(), selection.quantity()) != null)
          throw ApiException.invalid("No se puede repetir un ingrediente.");
      }
    }
    List<ValidatedMeal.SelectedIngredient> ingredients = new ArrayList<>();
    for (DishIngredient ingredient : dish.getIngredients()) {
      if (!ingredient.getProduct().isActive())
        throw ApiException.invalid("Un ingrediente de la receta no está disponible.");
      int quantity = quantities.getOrDefault(ingredient.getId(), ingredient.getDefaultQuantity());
      quantities.remove(ingredient.getId());
      if (quantity < ingredient.getMinQuantity()
          || quantity > ingredient.getMaxQuantity()
          || quantity % ingredient.getStepQuantity() != 0)
        throw ApiException.invalid(
            "Cantidad no permitida para " + ingredient.getProduct().getName() + ".");
      ingredients.add(new ValidatedMeal.SelectedIngredient(ingredient, quantity));
    }
    if (!quantities.isEmpty())
      throw ApiException.invalid("Hay ingredientes que no pertenecen al plato.");
    return new ValidatedMeal(
        dish,
        List.copyOf(ingredients),
        complement(request.drinkProductId(), ProductRole.DRINK),
        complement(request.dessertProductId(), ProductRole.DESSERT),
        request.quantity());
  }

  private Product complement(Long id, ProductRole role) {
    if (id == null) return null;
    Product product =
        products.findById(id).orElseThrow(() -> ApiException.missing("El complemento no existe."));
    if (!product.isEligible(role))
      throw ApiException.invalid(
          "El producto no está disponible como "
              + (role == ProductRole.DRINK ? "bebida." : "postre."));
    return product;
  }
}

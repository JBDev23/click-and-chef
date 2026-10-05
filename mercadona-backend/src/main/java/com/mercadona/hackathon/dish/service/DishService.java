package com.mercadona.hackathon.dish.service;

import com.mercadona.hackathon.common.exception.ApiException;
import com.mercadona.hackathon.common.util.Money;
import com.mercadona.hackathon.dish.dto.DishDetailResponse;
import com.mercadona.hackathon.dish.dto.DishSummaryResponse;
import com.mercadona.hackathon.dish.dto.IngredientResponse;
import com.mercadona.hackathon.dish.entity.Dish;
import com.mercadona.hackathon.dish.repository.DishRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DishService {
  private final DishRepository dishes;

  public DishService(DishRepository dishes) {
    this.dishes = dishes;
  }

  public List<DishSummaryResponse> list() {
    return dishes.findAllByActiveTrueOrderByIdAsc().stream()
        .map(
            dish ->
                new DishSummaryResponse(
                    dish.getId(),
                    dish.getSlug(),
                    dish.getName(),
                    dish.getDescription(),
                    dish.getImageUrl(),
                    Money.format(dish.getBasePrice()),
                    "EUR"))
        .toList();
  }

  public DishDetailResponse detail(Long id) {
    Dish dish =
        dishes
            .findActiveWithIngredients(id)
            .orElseThrow(() -> ApiException.missing("El plato no existe o no está disponible."));
    return new DishDetailResponse(
        dish.getId(),
        dish.getSlug(),
        dish.getName(),
        dish.getDescription(),
        dish.getImageUrl(),
        Money.format(dish.getBasePrice()),
        "EUR",
        dish.getIngredients().stream()
            .map(
                ingredient ->
                    new IngredientResponse(
                        ingredient.getId(),
                        ingredient.getProduct().getId(),
                        ingredient.getProduct().getSourceId(),
                        ingredient.getProduct().getName(),
                        ingredient.getProduct().isActive(),
                        ingredient.getDefaultQuantity(),
                        ingredient.getMinQuantity(),
                        ingredient.getMaxQuantity(),
                        ingredient.getStepQuantity(),
                        ingredient.getUnit(),
                        Money.format(ingredient.getExtraStepPrice())))
            .toList());
  }
}

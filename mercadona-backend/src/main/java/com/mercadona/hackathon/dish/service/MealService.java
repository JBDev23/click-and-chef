package com.mercadona.hackathon.dish.service;

import com.mercadona.hackathon.common.exception.ApiException;
import com.mercadona.hackathon.dish.dto.MealConfigurationRequest;
import com.mercadona.hackathon.dish.dto.MealPriceResponse;
import com.mercadona.hackathon.dish.entity.Dish;
import com.mercadona.hackathon.dish.model.PricedMeal;
import com.mercadona.hackathon.dish.repository.DishRepository;
import com.mercadona.hackathon.dish.validation.MealConfigurationValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MealService {
  private final DishRepository dishes;
  private final MealConfigurationValidator validator;
  private final MealPricingService pricing;

  public MealService(
      DishRepository dishes, MealConfigurationValidator validator, MealPricingService pricing) {
    this.dishes = dishes;
    this.validator = validator;
    this.pricing = pricing;
  }

  @Transactional(readOnly = true)
  public PricedMeal price(Long dishId, MealConfigurationRequest configuration) {
    Dish dish =
        dishes
            .findActiveWithIngredients(dishId)
            .orElseThrow(() -> ApiException.missing("El plato no existe o no está disponible."));
    return pricing.calculate(validator.validate(dish, configuration));
  }

  @Transactional(readOnly = true)
  public MealPriceResponse quote(Long dishId, MealConfigurationRequest configuration) {
    return MealPriceResponse.from(price(dishId, configuration));
  }
}

package com.mercadona.hackathon.dish.controller;

import com.mercadona.hackathon.dish.dto.DishDetailResponse;
import com.mercadona.hackathon.dish.dto.DishSummaryResponse;
import com.mercadona.hackathon.dish.dto.MealConfigurationRequest;
import com.mercadona.hackathon.dish.dto.MealPriceResponse;
import com.mercadona.hackathon.dish.service.DishService;
import com.mercadona.hackathon.dish.service.MealService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dishes")
@Tag(name = "Platos")
public class DishController {
  private final DishService dishes;
  private final MealService meals;

  public DishController(DishService dishes, MealService meals) {
    this.dishes = dishes;
    this.meals = meals;
  }

  @GetMapping
  public List<DishSummaryResponse> list() {
    return dishes.list();
  }

  @GetMapping("/{id}")
  public DishDetailResponse detail(@PathVariable Long id) {
    return dishes.detail(id);
  }

  @PostMapping("/{id}/quote")
  public MealPriceResponse quote(
      @PathVariable Long id, @Valid @RequestBody MealConfigurationRequest configuration) {
    return meals.quote(id, configuration);
  }
}

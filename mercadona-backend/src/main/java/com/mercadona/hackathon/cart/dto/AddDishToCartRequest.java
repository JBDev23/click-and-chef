package com.mercadona.hackathon.cart.dto;

import com.mercadona.hackathon.dish.dto.MealConfigurationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddDishToCartRequest(
    @NotNull @Positive Long dishId, @NotNull @Valid MealConfigurationRequest configuration) {}

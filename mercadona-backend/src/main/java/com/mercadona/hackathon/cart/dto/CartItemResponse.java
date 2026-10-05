package com.mercadona.hackathon.cart.dto;

import com.mercadona.hackathon.dish.dto.MealPriceResponse;

public record CartItemResponse(
    Long id, Long dishId, String dishName, int quantity, MealPriceResponse price) {}

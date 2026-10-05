package com.mercadona.hackathon.cart.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CartResponse(
    UUID cartId, String currency, List<CartItemResponse> items, String total, Instant createdAt) {}

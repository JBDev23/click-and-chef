package com.mercadona.hackathon.cart.dto;

import java.time.Instant;
import java.util.UUID;

public record CartCreatedResponse(
    UUID cartId, String cartToken, String currency, Instant createdAt) {}

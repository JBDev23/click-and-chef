package com.mercadona.hackathon.cart.controller;

import com.mercadona.hackathon.cart.dto.AddDishToCartRequest;
import com.mercadona.hackathon.cart.dto.CartCreatedResponse;
import com.mercadona.hackathon.cart.dto.CartResponse;
import com.mercadona.hackathon.cart.service.CartService;
import com.mercadona.hackathon.dish.dto.MealConfigurationRequest;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
@Tag(name = "Carritos")
public class CartController {
  private final CartService carts;

  public CartController(CartService carts) {
    this.carts = carts;
  }

  @PostMapping
  public ResponseEntity<CartCreatedResponse> create() {
    var cart = carts.create();
    return ResponseEntity.created(URI.create("/api/v1/carts/" + cart.cartId()))
        .cacheControl(CacheControl.noStore())
        .body(cart);
  }

  @GetMapping("/{id}")
  @SecurityRequirement(name = "CartToken")
  public ResponseEntity<CartResponse> get(
      @PathVariable UUID id,
      @Parameter(hidden = true) @RequestHeader(name = "X-Cart-Token", required = false)
          String token) {
    return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(carts.get(id, token));
  }

  @PostMapping("/{id}/items")
  @SecurityRequirement(name = "CartToken")
  public ResponseEntity<CartResponse> add(
      @PathVariable UUID id,
      @Parameter(hidden = true) @RequestHeader(name = "X-Cart-Token", required = false)
          String token,
      @Valid @RequestBody AddDishToCartRequest request) {
    return ResponseEntity.status(201)
        .cacheControl(CacheControl.noStore())
        .body(carts.add(id, token, request));
  }

  @PutMapping("/{id}/items/{itemId}")
  @SecurityRequirement(name = "CartToken")
  public ResponseEntity<CartResponse> update(
      @PathVariable UUID id,
      @PathVariable Long itemId,
      @Parameter(hidden = true) @RequestHeader(name = "X-Cart-Token", required = false)
          String token,
      @Valid @RequestBody MealConfigurationRequest configuration) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(carts.update(id, itemId, token, configuration));
  }

  @DeleteMapping("/{id}/items/{itemId}")
  @SecurityRequirement(name = "CartToken")
  public ResponseEntity<CartResponse> delete(
      @PathVariable UUID id,
      @PathVariable Long itemId,
      @Parameter(hidden = true) @RequestHeader(name = "X-Cart-Token", required = false)
          String token) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(carts.delete(id, itemId, token));
  }
}

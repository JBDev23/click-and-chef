package com.mercadona.hackathon.cart.service;

import com.mercadona.hackathon.cart.dto.AddDishToCartRequest;
import com.mercadona.hackathon.cart.dto.CartCreatedResponse;
import com.mercadona.hackathon.cart.dto.CartItemResponse;
import com.mercadona.hackathon.cart.dto.CartResponse;
import com.mercadona.hackathon.cart.entity.Cart;
import com.mercadona.hackathon.cart.entity.CartItem;
import com.mercadona.hackathon.cart.repository.CartRepository;
import com.mercadona.hackathon.catalog.entity.ProductRole;
import com.mercadona.hackathon.common.exception.ApiException;
import com.mercadona.hackathon.common.util.Money;
import com.mercadona.hackathon.dish.dto.MealConfigurationRequest;
import com.mercadona.hackathon.dish.dto.MealPriceResponse;
import com.mercadona.hackathon.dish.service.MealService;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {
  private final CartRepository carts;
  private final CartTokenService tokens;
  private final MealService meals;
  private final EntityManager entityManager;

  public CartService(
      CartRepository carts,
      CartTokenService tokens,
      MealService meals,
      EntityManager entityManager) {
    this.carts = carts;
    this.tokens = tokens;
    this.meals = meals;
    this.entityManager = entityManager;
  }

  @Transactional
  public CartCreatedResponse create() {
    String token = tokens.generate();
    Cart cart = carts.save(new Cart(tokens.hash(token)));
    return new CartCreatedResponse(cart.getId(), token, "EUR", cart.getCreatedAt());
  }

  @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
  public CartResponse get(UUID id, String token) {
    return response(authorized(id, token, false));
  }

  @Transactional
  public CartResponse add(UUID id, String token, AddDishToCartRequest request) {
    Cart cart = authorized(id, token, true);
    cart.add(new CartItem(cart, meals.price(request.dishId(), request.configuration())));
    carts.saveAndFlush(cart);
    return response(cart);
  }

  @Transactional
  public CartResponse update(
      UUID id, Long itemId, String token, MealConfigurationRequest configuration) {
    Cart cart = authorized(id, token, true);
    CartItem item = item(cart, itemId);
    var meal = meals.price(item.getDish().getId(), configuration);
    item.clearSelections();
    // Delete old snapshots before inserting their replacements (unique ingredient/addon keys).
    entityManager.flush();
    item.configure(meal);
    carts.saveAndFlush(cart);
    return response(cart);
  }

  @Transactional
  public CartResponse delete(UUID id, Long itemId, String token) {
    Cart cart = authorized(id, token, true);
    cart.remove(item(cart, itemId));
    carts.flush();
    return response(cart);
  }

  private Cart authorized(UUID id, String token, boolean lock) {
    Cart cart =
        (lock ? carts.findLockedById(id) : carts.findById(id))
            .orElseThrow(() -> ApiException.missing("El carrito no existe."));
    tokens.verify(cart, token);
    return cart;
  }

  private CartItem item(Cart cart, Long itemId) {
    return cart.getItems().stream()
        .filter(item -> item.getId().equals(itemId))
        .findFirst()
        .orElseThrow(() -> ApiException.missing("La línea no pertenece al carrito."));
  }

  private CartResponse response(Cart cart) {
    List<CartItemResponse> items =
        cart.getItems().stream()
            .map(
                item -> {
                  BigDecimal total =
                      item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                  var ingredients =
                      item.getIngredients().stream()
                          .map(
                              ingredient ->
                                  new MealPriceResponse.IngredientPriceResponse(
                                      ingredient.getDishIngredient().getId(),
                                      ingredient.getProduct().getId(),
                                      ingredient.getProductName(),
                                      ingredient.getDefaultQuantity(),
                                      ingredient.getSelectedQuantity(),
                                      ingredient.getUnit(),
                                      Money.format(ingredient.getExtraPrice())))
                          .toList();
                  var price =
                      new MealPriceResponse(
                          "EUR",
                          Money.format(item.getBasePrice()),
                          Money.format(item.getIngredientExtras()),
                          Money.format(item.getDrinkPrice()),
                          Money.format(item.getDessertPrice()),
                          Money.format(item.getUnitPrice()),
                          item.getQuantity(),
                          Money.format(total),
                          ingredients,
                          addon(item, ProductRole.DRINK),
                          addon(item, ProductRole.DESSERT));
                  return new CartItemResponse(
                      item.getId(),
                      item.getDish().getId(),
                      item.getDishName(),
                      item.getQuantity(),
                      price);
                })
            .toList();
    BigDecimal total =
        cart.getItems().stream()
            .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(Money.ZERO, BigDecimal::add);
    return new CartResponse(cart.getId(), "EUR", items, Money.format(total), cart.getCreatedAt());
  }

  private MealPriceResponse.AddonPriceResponse addon(CartItem item, ProductRole role) {
    return item.getAddons().stream()
        .filter(addon -> addon.getType() == role)
        .findFirst()
        .map(
            addon ->
                new MealPriceResponse.AddonPriceResponse(
                    addon.getProduct().getId(),
                    addon.getProductName(),
                    addon.getServingFormat(),
                    Money.format(addon.getPrice())))
        .orElse(null);
  }
}

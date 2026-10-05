package com.mercadona.hackathon.cart.entity;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.dish.entity.DishIngredient;
import com.mercadona.hackathon.dish.entity.MeasurementUnit;
import com.mercadona.hackathon.dish.model.PricedMeal;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_item_ingredient")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItemIngredient {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_item_id")
  private CartItem item;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "dish_ingredient_id")
  private DishIngredient dishIngredient;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id")
  private Product product;

  @Column(nullable = false, columnDefinition = "text")
  private String productName;

  @Column(nullable = false)
  private int defaultQuantity;

  @Column(nullable = false)
  private int selectedQuantity;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private MeasurementUnit unit;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal extraStepPrice;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal extraPrice;

  public CartItemIngredient(CartItem item, PricedMeal.PricedIngredient priced) {
    var recipe = priced.selection().recipe();
    this.item = item;
    this.dishIngredient = recipe;
    this.product = recipe.getProduct();
    this.productName = product.getName();
    this.defaultQuantity = recipe.getDefaultQuantity();
    this.selectedQuantity = priced.selection().quantity();
    this.unit = recipe.getUnit();
    this.extraStepPrice = recipe.getExtraStepPrice();
    this.extraPrice = priced.extraPrice();
  }
}

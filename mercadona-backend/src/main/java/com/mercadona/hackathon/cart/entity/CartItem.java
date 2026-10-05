package com.mercadona.hackathon.cart.entity;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.catalog.entity.ProductRole;
import com.mercadona.hackathon.dish.entity.Dish;
import com.mercadona.hackathon.dish.model.PricedMeal;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_id")
  private Cart cart;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "dish_id")
  private Dish dish;

  @Column(nullable = false, columnDefinition = "text")
  private String dishName;

  @Column(nullable = false)
  private int quantity;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal basePrice;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal ingredientExtras;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal drinkPrice;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal dessertPrice;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal unitPrice;

  @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("id ASC")
  private List<CartItemIngredient> ingredients = new ArrayList<>();

  @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("id ASC")
  private List<CartItemAddon> addons = new ArrayList<>();

  public CartItem(Cart cart, PricedMeal meal) {
    this.cart = cart;
    configure(meal);
  }

  public void clearSelections() {
    ingredients.clear();
    addons.clear();
  }

  public void configure(PricedMeal meal) {
    this.dish = meal.configuration().dish();
    this.dishName = dish.getName();
    this.quantity = meal.configuration().quantity();
    this.basePrice = meal.basePrice();
    this.ingredientExtras = meal.ingredientExtras();
    this.drinkPrice = meal.drinkPrice();
    this.dessertPrice = meal.dessertPrice();
    this.unitPrice = meal.unitPrice();
    meal.ingredients()
        .forEach(ingredient -> ingredients.add(new CartItemIngredient(this, ingredient)));
    addComplement(meal.configuration().drink(), ProductRole.DRINK);
    addComplement(meal.configuration().dessert(), ProductRole.DESSERT);
  }

  private void addComplement(Product product, ProductRole type) {
    if (product != null) addons.add(new CartItemAddon(this, product, type));
  }
}

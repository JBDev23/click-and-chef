package com.mercadona.hackathon.dish.entity;

import com.mercadona.hackathon.catalog.entity.Product;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dish")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Dish {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 100)
  private String slug;

  @Column(nullable = false, columnDefinition = "text")
  private String name;

  @Column(nullable = false, columnDefinition = "text")
  private String description;

  @Column(columnDefinition = "text")
  private String imageUrl;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal basePrice;

  @Column(nullable = false)
  private boolean active = true;

  @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("position ASC, id ASC")
  private List<DishIngredient> ingredients = new ArrayList<>();

  public Dish(String slug, String name, BigDecimal basePrice) {
    this.slug = slug;
    this.name = name;
    this.basePrice = basePrice;
    this.description = "Receta provisional de demostración.";
  }

  public void addIngredient(
      Product product,
      int included,
      int min,
      int max,
      int step,
      MeasurementUnit unit,
      BigDecimal supplement) {
    ingredients.add(
        new DishIngredient(
            this, product, included, min, max, step, unit, supplement, ingredients.size()));
  }
}

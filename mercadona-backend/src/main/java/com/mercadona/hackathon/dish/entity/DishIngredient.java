package com.mercadona.hackathon.dish.entity;

import com.mercadona.hackathon.catalog.entity.Product;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dish_ingredient")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DishIngredient {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "dish_id")
  private Dish dish;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id")
  private Product product;

  @Column(nullable = false)
  private int defaultQuantity;

  @Column(nullable = false)
  private int minQuantity;

  @Column(nullable = false)
  private int maxQuantity;

  @Column(nullable = false)
  private int stepQuantity;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private MeasurementUnit unit;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal extraStepPrice;

  @Column(nullable = false)
  private int position;

  DishIngredient(
      Dish dish,
      Product product,
      int included,
      int min,
      int max,
      int step,
      MeasurementUnit unit,
      BigDecimal supplement,
      int position) {
    this.dish = dish;
    this.product = product;
    this.defaultQuantity = included;
    this.minQuantity = min;
    this.maxQuantity = max;
    this.stepQuantity = step;
    this.unit = unit;
    this.extraStepPrice = supplement;
    this.position = position;
  }
}

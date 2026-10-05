package com.mercadona.hackathon.catalog.service;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.catalog.entity.ProductRole;
import com.mercadona.hackathon.catalog.repository.ProductRepository;
import com.mercadona.hackathon.common.util.Money;
import com.mercadona.hackathon.dish.entity.Dish;
import com.mercadona.hackathon.dish.entity.MeasurementUnit;
import com.mercadona.hackathon.dish.repository.DishRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemoDataService {
  private final ProductRepository products;
  private final DishRepository dishes;

  public DemoDataService(ProductRepository products, DishRepository dishes) {
    this.products = products;
    this.dishes = dishes;
  }

  @Transactional
  public void seed() {
    complement(2820, ProductRole.DRINK, "0.29", "Botella 500 ml");
    complement(2778, ProductRole.DRINK, "0.92", "Lata 330 ml");
    complement(2783, ProductRole.DRINK, "0.92", "Lata 330 ml");
    complement(1587, ProductRole.DESSERT, "0.38", "1 flan de 100 g");
    seedPasta("pasta-tomate-queso", "Pasta con tomate y queso", "5.90", false);
    seedPasta("pasta-pollo", "Pasta con pollo", "6.90", true);
    if (dishes.findBySlug("paella-marisco").isEmpty()) {
      Dish dish = new Dish("paella-marisco", "Paella de marisco", new BigDecimal("7.90"));
      ingredient(dish, 1641, 100, 1000);
      ingredient(dish, 121, 150, 685);
      ingredient(dish, 1818, 50, 400);
      ingredient(dish, 2572, 50, 1000);
      dishes.save(dish);
    }
  }

  private void seedPasta(String slug, String name, String price, boolean withChicken) {
    if (dishes.findBySlug(slug).isPresent()) return;
    Dish dish = new Dish(slug, name, new BigDecimal(price));
    ingredient(dish, 2132, 100, 500);
    ingredient(dish, 1818, 100, 400);
    ingredient(dish, 692, 50, 200);
    if (withChicken) ingredient(dish, 530, 100, 140);
    dishes.save(dish);
  }

  private void ingredient(Dish dish, long sourceId, int included, int packageGrams) {
    Product product = product(sourceId);
    BigDecimal supplement =
        Money.round(
            product
                .getPrice()
                .multiply(BigDecimal.valueOf(25))
                .divide(BigDecimal.valueOf(packageGrams), 8, RoundingMode.HALF_UP));
    dish.addIngredient(product, included, 0, included * 2, 25, MeasurementUnit.G, supplement);
  }

  private void complement(long sourceId, ProductRole role, String price, String format) {
    Product product = product(sourceId);
    if (product.getServingPrice() == null)
      product.configureComplement(role, new BigDecimal(price), format);
  }

  private Product product(long sourceId) {
    return products
        .findBySourceId(sourceId)
        .orElseThrow(() -> new IllegalStateException("Falta el producto de demo " + sourceId));
  }
}

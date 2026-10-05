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
    seedEnsaladaPastaAtun();
    seedLasanaVerduras();
    seedPastaCarbonara();
    if (dishes.findBySlug("paella-marisco").isEmpty()) {
      Dish dish = new Dish("paella-marisco", "Paella de marisco", new BigDecimal("7.90"));
      ingredient(dish, 1641, 100, 1000, MeasurementUnit.G);
      ingredient(dish, 121, 150, 685, MeasurementUnit.G);
      ingredient(dish, 1818, 50, 400, MeasurementUnit.G);
      ingredient(dish, 2572, 50, 1000, MeasurementUnit.G);
      dishes.save(dish);
    }
  }

  private void seedPasta(String slug, String name, String price, boolean withChicken) {
    if (dishes.findBySlug(slug).isPresent()) return;
    Dish dish = new Dish(slug, name, new BigDecimal(price));
    ingredient(dish, 2132, 100, 500, MeasurementUnit.G);
    ingredient(dish, 1818, 100, 400, MeasurementUnit.G);
    ingredient(dish, 692, 50, 200, MeasurementUnit.G);
    if (withChicken) ingredient(dish, 530, 100, 140, MeasurementUnit.G);
    dishes.save(dish);
  }

  private void seedEnsaladaPastaAtun() {
    if (dishes.findBySlug("ensalada-pasta-atun").isPresent()) return;
    Dish dish = new Dish("ensalada-pasta-atun", "Ensalada de pasta con atún", new BigDecimal("6.50"));
    ingredient(dish, 2132, 100, 500, MeasurementUnit.G);
    ingredient(dish, 1929, 75, 180, MeasurementUnit.G);
    ingredient(dish, 40, 75, 250, MeasurementUnit.G);
    dishes.save(dish);
  }

  private void seedLasanaVerduras() {
    if (dishes.findBySlug("lasana-verduras").isPresent()) return;
    Dish dish = new Dish("lasana-verduras", "Lasaña de verduras", new BigDecimal("7.20"));
    ingredient(dish, 2171, 100, 200, MeasurementUnit.G);
    ingredient(dish, 1133, 100, 600, MeasurementUnit.ML);
    ingredient(dish, 2580, 75, 1000, MeasurementUnit.G);
    ingredient(dish, 692, 50, 200, MeasurementUnit.G);
    dishes.save(dish);
  }

  private void seedPastaCarbonara() {
    if (dishes.findBySlug("pasta-carbonara").isPresent()) return;
    Dish dish = new Dish("pasta-carbonara", "Pasta a la carbonara", new BigDecimal("6.80"));
    ingredient(dish, 2144, 100, 500, MeasurementUnit.G);
    ingredient(dish, 1128, 50, 197, MeasurementUnit.G);
    ingredient(dish, 692, 50, 200, MeasurementUnit.G);
    dishes.save(dish);
  }

  private void ingredient(
      Dish dish, long sourceId, int included, int packageSize, MeasurementUnit unit) {
    Product product = product(sourceId);
    BigDecimal supplement =
        Money.round(
            product
                .getPrice()
                .multiply(BigDecimal.valueOf(25))
                .divide(BigDecimal.valueOf(packageSize), 8, RoundingMode.HALF_UP));
    dish.addIngredient(product, included, 0, included * 2, 25, unit, supplement);
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

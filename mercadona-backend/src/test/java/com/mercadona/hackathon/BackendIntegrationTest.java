package com.mercadona.hackathon;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mercadona.hackathon.cart.dto.AddDishToCartRequest;
import com.mercadona.hackathon.cart.service.CartService;
import com.mercadona.hackathon.catalog.service.DemoDataService;
import com.mercadona.hackathon.catalog.service.ProductImportService;
import com.mercadona.hackathon.dish.dto.MealConfigurationRequest;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("demo")
@Import(TestDatabaseConfiguration.class)
class BackendIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper mapper;
  @Autowired JdbcTemplate jdbc;
  @Autowired CartService carts;
  @Autowired ProductImportService importer;
  @Autowired DemoDataService demo;

  @BeforeEach
  void clearCarts() {
    jdbc.update("DELETE FROM cart_item_addon");
    jdbc.update("DELETE FROM cart_item_ingredient");
    jdbc.update("DELETE FROM cart_item");
    jdbc.update("DELETE FROM cart");
  }

  @Test
  void migratesAndLoadsRealCatalogAndThreeRecipes() throws Exception {
    assertThat(jdbc.queryForObject("SELECT count(*) FROM product", Integer.class)).isEqualTo(4723);
    assertThat(
            jdbc.queryForObject(
                "SELECT count(*) FROM flyway_schema_history WHERE success", Integer.class))
        .isEqualTo(1);
    assertThat(
            jdbc.queryForObject(
                "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('product','dish','dish_ingredient','cart','cart_item','cart_item_ingredient','cart_item_addon')",
                Integer.class))
        .isEqualTo(7);
    mvc.perform(get("/api/v1/dishes"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(3));
    for (var entry :
        Map.of("pasta-tomate-queso", "5.90", "pasta-pollo", "6.90", "paella-marisco", "7.90")
            .entrySet()) {
      mvc.perform(
              post("/api/v1/dishes/{id}/quote", dish(entry.getKey()))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"quantity\":1}"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.unitPrice").value(entry.getValue()))
          .andExpect(jsonPath("$.currency").value("EUR"));
    }
    mvc.perform(get("/api/test")).andExpect(status().isOk());
  }

  @Test
  void reductionsDoNotDiscountAndExtrasAreChargedPerIngredientAndRation() throws Exception {
    long dish = dish("pasta-tomate-queso");
    var recipe =
        json(mvc.perform(get("/api/v1/dishes/{id}", dish)).andExpect(status().isOk()).andReturn());
    List<Map<String, Object>> removals = new ArrayList<>();
    recipe
        .get("ingredients")
        .forEach(
            ingredient ->
                removals.add(
                    Map.of(
                        "dishIngredientId",
                        ingredient.get("dishIngredientId").asLong(),
                        "quantity",
                        0)));
    mvc.perform(
            post("/api/v1/dishes/{id}/quote", dish)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Map.of("ingredients", removals, "quantity", 1))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.unitPrice").value("5.90"));
    var configuration =
        Map.of(
            "quantity",
            2,
            "ingredients",
            List.of(
                Map.of("dishIngredientId", ingredient(dish, 692), "quantity", 75),
                Map.of("dishIngredientId", ingredient(dish, 1818), "quantity", 0)));
    var quote = quote(dish, configuration);
    assertThat(quote.get("ingredientExtras").asText()).isEqualTo("0.22");
    assertThat(quote.get("unitPrice").asText()).isEqualTo("6.12");
    assertThat(quote.get("total").asText()).isEqualTo("12.24");
    assertThat(
            jdbc.queryForObject(
                "SELECT default_quantity FROM dish_ingredient WHERE id=?",
                Integer.class,
                ingredient(dish, 692)))
        .isEqualTo(50);
  }

  @Test
  void listsOnlyIndividualEligibleBeveragesAndChargesDessertByServing() throws Exception {
    var drinks =
        json(
            mvc.perform(get("/api/v1/products").param("role", "DRINK"))
                .andExpect(status().isOk())
                .andReturn());
    List<Long> sourceIds = new ArrayList<>();
    drinks.forEach(drink -> sourceIds.add(drink.get("sourceId").asLong()));
    assertThat(sourceIds).containsExactlyInAnyOrder(2820L, 2778L, 2783L);
    for (var entry : Map.of(2820L, "0.29", 2778L, "0.92", 2783L, "0.92").entrySet()) {
      var quote =
          quote(
              dish("pasta-tomate-queso"),
              Map.of(
                  "quantity",
                  2,
                  "drinkProductId",
                  product(entry.getKey()),
                  "dessertProductId",
                  product(1587)));
      assertThat(quote.get("drinkPrice").asText()).isEqualTo(entry.getValue());
      assertThat(quote.get("dessertPrice").asText()).isEqualTo("0.38");
      assertThat(quote.get("total").asText())
          .isEqualTo(entry.getKey() == 2820L ? "13.14" : "14.40");
    }
    mvc.perform(get("/api/v1/products").param("role", "DESSERT"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].price").value("0.38"));
    assertThat(
            jdbc.queryForObject("SELECT price FROM product WHERE source_id=1587", BigDecimal.class))
        .isEqualByComparingTo("1.50");
  }

  @Test
  void rejectsInvalidSelectionsAndMissingResources() throws Exception {
    long dish = dish("pasta-tomate-queso"), cheese = ingredient(dish, 692);
    var valid = Map.of("dishIngredientId", cheese, "quantity", 75);
    List<Map<String, Object>> invalid =
        List.of(
            Map.of("quantity", 0),
            Map.of("quantity", 100),
            Map.of("quantity", 1, "ingredients", List.of(valid, valid)),
            Map.of(
                "quantity",
                1,
                "ingredients",
                List.of(
                    Map.of(
                        "dishIngredientId", ingredient(dish("pasta-pollo"), 692), "quantity", 75))),
            Map.of(
                "quantity",
                1,
                "ingredients",
                List.of(Map.of("dishIngredientId", cheese, "quantity", 13))),
            Map.of(
                "quantity",
                1,
                "ingredients",
                List.of(Map.of("dishIngredientId", cheese, "quantity", -25))),
            Map.of(
                "quantity",
                1,
                "ingredients",
                List.of(Map.of("dishIngredientId", cheese, "quantity", 125))),
            Map.of("quantity", 1, "drinkProductId", product(2132)),
            Map.of("quantity", 1, "drinkProductId", product(1587)),
            Map.of("quantity", 1, "dessertProductId", product(2820)));
    for (var configuration : invalid) {
      mvc.perform(
              post("/api/v1/dishes/{id}/quote", dish)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(mapper.writeValueAsString(configuration)))
          .andExpect(status().isBadRequest())
          .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }
    for (String body :
        List.of(
            "{}",
            "{\"quantity\":1,\"ingredients\":[null]}",
            "{\"quantity\":1,\"ingredients\":[{}]}")) {
      mvc.perform(
              post("/api/v1/dishes/{id}/quote", dish)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(body))
          .andExpect(status().isBadRequest());
    }
    mvc.perform(
            post("/api/v1/dishes/{id}/quote", dish)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"quantity\":1,\"drinkProductId\":9223372036854775807}"))
        .andExpect(status().isNotFound());
    mvc.perform(get("/api/v1/dishes/9223372036854775807")).andExpect(status().isNotFound());
    mvc.perform(get("/api/v1/products").param("role", "UNKNOWN"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void rejectsUnavailableRecipeProductsAndComplements() throws Exception {
    long dish = dish("pasta-tomate-queso");
    jdbc.update("UPDATE product SET active=false WHERE source_id IN (692,2820)");
    try {
      mvc.perform(
              post("/api/v1/dishes/{id}/quote", dish)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"quantity\":1}"))
          .andExpect(status().isBadRequest());
      mvc.perform(get("/api/v1/products").param("role", "DRINK"))
          .andExpect(jsonPath("$.length()").value(2));
    } finally {
      jdbc.update("UPDATE product SET active=true WHERE source_id IN (692,2820)");
    }
  }

  @Test
  void createsStrongSecretAndIsolatesGuestCarts() throws Exception {
    var first = createCart();
    var second = createCart();
    String token = first.get("cartToken").asText();
    String id = first.get("cartId").asText();
    assertThat(Base64.getUrlDecoder().decode(token)).hasSize(32);
    String hash =
        jdbc.queryForObject(
            "SELECT token_hash FROM cart WHERE id=?", String.class, UUID.fromString(id));
    assertThat(hash).hasSize(64).isNotEqualTo(token);
    mvc.perform(get("/api/v1/carts/{id}", id)).andExpect(status().isForbidden());
    mvc.perform(get("/api/v1/carts/{id}", id).header("X-Cart-Token", "wrong"))
        .andExpect(status().isForbidden());
    mvc.perform(
            get("/api/v1/carts/{id}", id).header("X-Cart-Token", second.get("cartToken").asText()))
        .andExpect(status().isForbidden());
    mvc.perform(get("/api/v1/carts/{id}", id).header("X-Cart-Token", token))
        .andExpect(status().isOk())
        .andExpect(header().string("Cache-Control", "no-store"))
        .andExpect(jsonPath("$.total").value("0.00"))
        .andExpect(jsonPath("$.cartToken").doesNotExist())
        .andExpect(jsonPath("$.tokenHash").doesNotExist());
  }

  @Test
  void persistsIndependentConfigurationsAndMatchesQuote() throws Exception {
    var cart = createCart();
    long dish = dish("pasta-tomate-queso");
    add(cart, dish, Map.of("quantity", 1));
    var configuration =
        Map.of(
            "quantity",
            2,
            "ingredients",
            List.of(Map.of("dishIngredientId", ingredient(dish, 692), "quantity", 75)));
    var quoted = quote(dish, configuration);
    var added = add(cart, dish, configuration);
    assertThat(added.get("items").size()).isEqualTo(2);
    assertThat(added.get("items").get(1).get("price")).isEqualTo(quoted);
    assertThat(added.get("total").asText()).isEqualTo("18.14");
    assertThat(readCart(cart)).isEqualTo(added);
  }

  @Test
  void replacesSelectionsWithoutDuplicateChildrenAndDeletesLines() throws Exception {
    var cart = createCart();
    long dish = dish("pasta-tomate-queso");
    var configuration =
        Map.of("quantity", 1, "drinkProductId", product(2820), "dessertProductId", product(1587));
    long item = add(cart, dish, configuration).get("items").get(0).get("id").asLong();
    var replacement =
        Map.of(
            "quantity",
            2,
            "drinkProductId",
            product(2778),
            "dessertProductId",
            product(1587),
            "ingredients",
            List.of(Map.of("dishIngredientId", ingredient(dish, 692), "quantity", 75)));
    for (int i = 0; i < 2; i++) {
      var updated =
          json(
              mvc.perform(
                      put("/api/v1/carts/{id}/items/{item}", cart.get("cartId").asText(), item)
                          .header("X-Cart-Token", cart.get("cartToken").asText())
                          .contentType(MediaType.APPLICATION_JSON)
                          .content(mapper.writeValueAsString(replacement)))
                  .andExpect(status().isOk())
                  .andReturn());
      assertThat(updated.get("total").asText()).isEqualTo("14.84");
    }
    assertThat(
            jdbc.queryForObject(
                "SELECT count(*) FROM cart_item_ingredient WHERE cart_item_id=?",
                Integer.class,
                item))
        .isEqualTo(3);
    assertThat(
            jdbc.queryForObject(
                "SELECT count(*) FROM cart_item_addon WHERE cart_item_id=?", Integer.class, item))
        .isEqualTo(2);
    mvc.perform(
            delete("/api/v1/carts/{id}/items/{item}", cart.get("cartId").asText(), item)
                .header("X-Cart-Token", cart.get("cartToken").asText()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.total").value("0.00"));
    assertThat(jdbc.queryForObject("SELECT count(*) FROM cart_item_ingredient", Integer.class))
        .isZero();
    assertThat(jdbc.queryForObject("SELECT count(*) FROM cart_item_addon", Integer.class)).isZero();
  }

  @Test
  void invalidUpdateLeavesPreviousConfigurationIntactAndForeignLineIsNotAccessible()
      throws Exception {
    var cart = createCart();
    var other = createCart();
    long dish = dish("pasta-tomate-queso");
    var before = add(cart, dish, Map.of("quantity", 1));
    long item = before.get("items").get(0).get("id").asLong();
    var invalid =
        Map.of(
            "quantity",
            1,
            "ingredients",
            List.of(Map.of("dishIngredientId", ingredient(dish, 692), "quantity", 13)));
    mvc.perform(
            put("/api/v1/carts/{id}/items/{item}", cart.get("cartId").asText(), item)
                .header("X-Cart-Token", cart.get("cartToken").asText())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(invalid)))
        .andExpect(status().isBadRequest());
    assertThat(readCart(cart)).isEqualTo(before);
    mvc.perform(
            delete("/api/v1/carts/{id}/items/{item}", other.get("cartId").asText(), item)
                .header("X-Cart-Token", other.get("cartToken").asText()))
        .andExpect(status().isNotFound());
    assertThat(readCart(cart)).isEqualTo(before);
  }

  @Test
  void preservesSnapshotsUntilExplicitlyEdited() throws Exception {
    var cart = createCart();
    long dish = dish("pasta-tomate-queso"), cheese = ingredient(dish, 692);
    var configuration =
        Map.of(
            "quantity",
            1,
            "drinkProductId",
            product(2820),
            "dessertProductId",
            product(1587),
            "ingredients",
            List.of(Map.of("dishIngredientId", cheese, "quantity", 75)));
    var before = add(cart, dish, configuration);
    long item = before.get("items").get(0).get("id").asLong();
    String dishName = jdbc.queryForObject("SELECT name FROM dish WHERE id=?", String.class, dish);
    String waterName =
        jdbc.queryForObject("SELECT name FROM product WHERE source_id=2820", String.class);
    jdbc.update("UPDATE dish SET base_price=100.00,name='Nombre cambiado' WHERE id=?", dish);
    jdbc.update(
        "UPDATE product SET serving_price=9.00,name='Bebida cambiada' WHERE source_id=2820");
    jdbc.update("UPDATE dish_ingredient SET extra_step_price=2.00 WHERE id=?", cheese);
    try {
      assertThat(readCart(cart)).isEqualTo(before);
      assertThat(quote(dish, configuration).get("unitPrice").asText()).isEqualTo("111.38");
      mvc.perform(
              put("/api/v1/carts/{id}/items/{item}", cart.get("cartId").asText(), item)
                  .header("X-Cart-Token", cart.get("cartToken").asText())
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(mapper.writeValueAsString(configuration)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.total").value("111.38"));
    } finally {
      jdbc.update("UPDATE dish SET base_price=5.90,name=? WHERE id=?", dishName, dish);
      jdbc.update("UPDATE product SET serving_price=0.29,name=? WHERE source_id=2820", waterName);
      jdbc.update("UPDATE dish_ingredient SET extra_step_price=0.22 WHERE id=?", cheese);
    }
  }

  @Test
  void serializesConcurrentWritesWithoutLosingLines() throws Exception {
    var cart = carts.create();
    long dish = dish("pasta-tomate-queso");
    CountDownLatch start = new CountDownLatch(1);
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      List<Future<?>> results = new ArrayList<>();
      for (int i = 0; i < 8; i++)
        results.add(
            executor.submit(
                () -> {
                  start.await();
                  return carts.add(
                      cart.cartId(),
                      cart.cartToken(),
                      new AddDishToCartRequest(
                          dish, new MealConfigurationRequest(List.of(), null, null, 1)));
                }));
      start.countDown();
      for (var result : results) result.get(30, TimeUnit.SECONDS);
    }
    var stored = carts.get(cart.cartId(), cart.cartToken());
    assertThat(stored.items()).hasSize(8);
    assertThat(stored.total()).isEqualTo("47.20");
  }

  @Test
  void reimportAndDemoInitializationAreIdempotentAndPreserveCommercialRules() {
    jdbc.update("UPDATE product SET serving_price=1.23 WHERE source_id=2820");
    try {
      assertThat(importer.importCsv(new ClassPathResource("catalog/products_macro.csv")))
          .isEqualTo(4723);
      demo.seed();
      assertThat(jdbc.queryForObject("SELECT count(*) FROM product", Integer.class))
          .isEqualTo(4723);
      assertThat(jdbc.queryForObject("SELECT count(*) FROM dish", Integer.class)).isEqualTo(3);
      assertThat(jdbc.queryForObject("SELECT count(*) FROM dish_ingredient", Integer.class))
          .isEqualTo(11);
      assertThat(
              jdbc.queryForObject(
                  "SELECT serving_price FROM product WHERE source_id=2820", BigDecimal.class))
          .isEqualByComparingTo("1.23");
      assertThat(
              jdbc.queryForObject(
                  "SELECT price FROM product WHERE source_id=2820", BigDecimal.class))
          .isEqualByComparingTo("0.29");
    } finally {
      jdbc.update("UPDATE product SET serving_price=0.29 WHERE source_id=2820");
    }
  }

  @Test
  void importsQuotedCommaFieldsAndRejectsInvalidCatalogWithoutPartialWrites() {
    String header =
        "id,Category,name,subtitle,price,discount_price,main_image_url,secondary_image_url,nutritional_info\n";
    String row =
        "90001,Prueba,\"Producto, \"\"especial\"\"\",Paquete 500 g,\"1,73 €\",,,,\"Texto, con coma\"\n";
    try {
      assertThat(importer.importCsv(csv(header + row))).isEqualTo(1);
      assertThat(
              jdbc.queryForObject("SELECT name FROM product WHERE source_id=90001", String.class))
          .isEqualTo("Producto, \"especial\"");
      assertThat(
              jdbc.queryForObject(
                  "SELECT price FROM product WHERE source_id=90001", BigDecimal.class))
          .isEqualByComparingTo("1.73");
    } finally {
      jdbc.update("DELETE FROM product WHERE source_id=90001");
    }
    assertThatThrownBy(() -> importer.importCsv(csv(header + row + row)))
        .isInstanceOf(IllegalArgumentException.class);
    assertThatThrownBy(
            () -> importer.importCsv(csv(header + row + "90002,Prueba,Otro,Paquete,INVALID,,,,\n")))
        .isInstanceOf(IllegalArgumentException.class);
    assertThat(
            jdbc.queryForObject(
                "SELECT count(*) FROM product WHERE source_id IN (90001,90002)", Integer.class))
        .isZero();
    assertThat(jdbc.queryForObject("SELECT count(*) FROM product", Integer.class)).isEqualTo(4723);
  }

  @Test
  void exposesSwaggerCartSecurityAndAllowsConfiguredCorsHeader() throws Exception {
    mvc.perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.components.securitySchemes.CartToken.name").value("X-Cart-Token"))
        .andExpect(jsonPath("$.paths['/api/v1/carts/{id}'].get.security[0].CartToken").exists());
    mvc.perform(
            options("/api/v1/carts")
                .header("Origin", "http://localhost:8081")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "Content-Type,X-Cart-Token"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:8081"));
    mvc.perform(
            options("/api/v1/carts")
                .header("Origin", "https://unconfigured.example")
                .header("Access-Control-Request-Method", "POST"))
        .andExpect(status().isForbidden());
  }

  private long dish(String slug) {
    return jdbc.queryForObject("SELECT id FROM dish WHERE slug=?", Long.class, slug);
  }

  private long product(long sourceId) {
    return jdbc.queryForObject("SELECT id FROM product WHERE source_id=?", Long.class, sourceId);
  }

  private long ingredient(long dish, long sourceId) {
    return jdbc.queryForObject(
        "SELECT i.id FROM dish_ingredient i JOIN product p ON p.id=i.product_id WHERE i.dish_id=? AND p.source_id=?",
        Long.class,
        dish,
        sourceId);
  }

  private JsonNode json(MvcResult result) throws Exception {
    return mapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
  }

  private JsonNode quote(long dish, Map<String, ?> configuration) throws Exception {
    return json(
        mvc.perform(
                post("/api/v1/dishes/{id}/quote", dish)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(configuration)))
            .andExpect(status().isOk())
            .andReturn());
  }

  private JsonNode createCart() throws Exception {
    return json(mvc.perform(post("/api/v1/carts")).andExpect(status().isCreated()).andReturn());
  }

  private JsonNode add(JsonNode cart, long dish, Map<String, ?> configuration) throws Exception {
    return json(
        mvc.perform(
                post("/api/v1/carts/{id}/items", cart.get("cartId").asText())
                    .header("X-Cart-Token", cart.get("cartToken").asText())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        mapper.writeValueAsString(
                            Map.of("dishId", dish, "configuration", configuration))))
            .andExpect(status().isCreated())
            .andReturn());
  }

  private JsonNode readCart(JsonNode cart) throws Exception {
    return json(
        mvc.perform(
                get("/api/v1/carts/{id}", cart.get("cartId").asText())
                    .header("X-Cart-Token", cart.get("cartToken").asText()))
            .andExpect(status().isOk())
            .andReturn());
  }

  private ByteArrayResource csv(String text) {
    return new ByteArrayResource(text.getBytes(StandardCharsets.UTF_8));
  }
}

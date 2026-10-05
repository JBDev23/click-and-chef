package com.mercadona.hackathon.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadona.hackathon.model.MatchedProductResponse;
import com.mercadona.hackathon.model.ProductSelectionResponse;
import com.mercadona.hackathon.model.RecipeResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class LayaService {

  /**
   * Usa /webhook/ (producción), NO /webhook-test/. En n8n: Publish el workflow. El modo Execute
   * solo escucha 1 petición.
   */
  private final String RECIPE_WEBHOOK_URL = "http://127.0.0.1:45678/webhook/laya";

  private final String SELECT_WEBHOOK_URL = "http://127.0.0.1:45678/webhook/laya-select";

  private final RestTemplate restTemplate;
  private final ObjectMapper mapper;

  public LayaService() {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(5_000);
    factory.setReadTimeout(90_000);
    this.restTemplate = new RestTemplate(factory);
    this.mapper = new ObjectMapper();
  }

  public RecipeResponse sendToLayaRecipe(String message) {
    Map<String, String> body = Map.of("message", message);
    try {
      System.out.println("[Laya] Pasada1 → " + RECIPE_WEBHOOK_URL);
      ResponseEntity<String> response = postJson(RECIPE_WEBHOOK_URL, body);
      System.out.println("[Laya] Pasada1 OK status=" + response.getStatusCode());
      return mapper.readValue(response.getBody(), RecipeResponse.class);
    } catch (Exception e) {
      System.err.println("[Laya] Pasada1 FAIL: " + e.getMessage());
      e.printStackTrace();
      return null;
    }
  }

  /**
   * Envía candidatos del catálogo (DB) al LLM. En candidatos, {@code id} es el {@code sourceId} del
   * CSV (estable); {@code productId} es el id de Postgres.
   */
  public ProductSelectionResponse selectProducts(
      String plato, Map<String, List<MatchedProductResponse>> candidatesByIngredient) {
    List<Map<String, Object>> ingredientes = new ArrayList<>();

    for (Map.Entry<String, List<MatchedProductResponse>> entry :
        candidatesByIngredient.entrySet()) {
      Map<String, Object> block = new HashMap<>();
      block.put("ingrediente", entry.getKey());
      block.put(
          "candidatos",
          entry.getValue().stream()
              .map(
                  p -> {
                    Map<String, String> c = new HashMap<>();
                    // sourceId: lo que el LLM debe devolver (id del catálogo CSV)
                    c.put("id", String.valueOf(p.sourceId()));
                    c.put("productId", String.valueOf(p.id()));
                    c.put("name", p.name());
                    c.put("category", p.category());
                    c.put("subtitle", p.subtitle());
                    c.put("price", p.price());
                    return c;
                  })
              .collect(Collectors.toList()));
      ingredientes.add(block);
    }

    Map<String, Object> body = new HashMap<>();
    body.put("plato", plato);
    body.put("ingredientes", ingredientes);

    try {
      System.out.println("[Laya] Pasada2 → " + SELECT_WEBHOOK_URL);
      ResponseEntity<String> response = postJson(SELECT_WEBHOOK_URL, body);
      System.out.println("[Laya] Pasada2 OK status=" + response.getStatusCode());
      return mapper.readValue(response.getBody(), ProductSelectionResponse.class);
    } catch (Exception e) {
      System.err.println("[Laya] Pasada2 FAIL (fallback ranking): " + e.getMessage());
      e.printStackTrace();
      return null;
    }
  }

  private ResponseEntity<String> postJson(String url, Object body) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Object> request = new HttpEntity<>(body, headers);
    return restTemplate.postForEntity(url, request, String.class);
  }
}

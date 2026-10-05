package com.mercadona.hackathon.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadona.hackathon.model.Product;
import com.mercadona.hackathon.model.ProductSelectionResponse;
import com.mercadona.hackathon.model.RecipeResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LayaService {

    /**
     * Usa /webhook/ (producción), NO /webhook-test/.
     * En n8n: activa el workflow (toggle Active). El modo Execute solo escucha 1 petición.
     */
    private final String RECIPE_WEBHOOK_URL = "http://127.0.0.1:45678/webhook/laya";
    private final String SELECT_WEBHOOK_URL = "http://127.0.0.1:45678/webhook/laya-select";

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;

    public LayaService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(90_000); // LLM puede tardar
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
     * Envía al LLM los candidatos del CSV para que elija los mejores IDs por ingrediente.
     * Si falla n8n, devuelve null y el controller hace fallback al ranking.
     */
    public ProductSelectionResponse selectProducts(String plato, Map<String, List<Product>> candidatesByIngredient) {
        List<Map<String, Object>> ingredientes = new ArrayList<>();

        for (Map.Entry<String, List<Product>> entry : candidatesByIngredient.entrySet()) {
            Map<String, Object> block = new HashMap<>();
            block.put("ingrediente", entry.getKey());
            block.put("candidatos", entry.getValue().stream().map(p -> {
                Map<String, String> c = new HashMap<>();
                c.put("id", p.getId());
                c.put("name", p.getName());
                c.put("category", p.getCategory());
                c.put("subtitle", p.getSubtitle());
                c.put("price", p.getPrice());
                return c;
            }).collect(Collectors.toList()));
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

package com.mercadona.hackathon.controller;

import com.mercadona.hackathon.model.Product;
import com.mercadona.hackathon.model.ProductSelectionResponse;
import com.mercadona.hackathon.model.RecipeResponse;
import com.mercadona.hackathon.service.LayaService;
import com.mercadona.hackathon.service.ProductCsvService;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/laya")
public class LayaController {

    private static final int MAX_SELECTED = 1;
    private static final int FALLBACK_LIMIT = 1;

    private final LayaService layaService;
    private final ProductCsvService productCsvService;

    public LayaController(LayaService layaService, ProductCsvService productCsvService) {
        this.layaService = layaService;
        this.productCsvService = productCsvService;
    }

    @PostMapping("/recipe")
    public Map<String, Object> recipeToCart(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Quiero macarrones");
        RecipeResponse recipe = layaService.sendToLayaRecipe(message);

        Map<String, Object> result = new LinkedHashMap<>();
        if (recipe == null || recipe.getIngredientes() == null) {
            result.put("error", "No se pudo extraer la receta. Asegúrate de que n8n devuelve el JSON correcto.");
            return result;
        }

        List<String> ingredients = recipe.getIngredientes().stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .collect(Collectors.toList());

        result.put("plato", recipe.getPlato());

        Map<String, List<Product>> candidates = new LinkedHashMap<>();
        for (String ingredient : ingredients) {
            candidates.put(ingredient, productCsvService.searchCandidates(ingredient));
        }

        ProductSelectionResponse selection = layaService.selectProducts(recipe.getPlato(), candidates);
        Map<String, List<Product>> cart = applySelection(candidates, selection);

        result.put("carrito", cart);
        result.put("pasada2", selection != null);
        return result;
    }

    private Map<String, List<Product>> applySelection(
            Map<String, List<Product>> candidates,
            ProductSelectionResponse selection) {

        Map<String, List<Product>> cart = new LinkedHashMap<>();

        if (selection == null || selection.getSelecciones() == null) {
            for (Map.Entry<String, List<Product>> entry : candidates.entrySet()) {
                cart.put(entry.getKey(), limit(entry.getValue(), FALLBACK_LIMIT));
            }
            return cart;
        }

        List<ProductSelectionResponse.Selection> selecciones = selection.getSelecciones();

        for (Map.Entry<String, List<Product>> entry : candidates.entrySet()) {
            String key = entry.getKey();
            List<Product> options = entry.getValue();

            ProductSelectionResponse.Selection match = findSelection(key, selecciones);
            if (match == null || match.getIds() == null || match.getIds().isEmpty()) {
                // Sin match del LLM → top del ranking (no tirar 4 random)
                cart.put(key, limit(options, FALLBACK_LIMIT));
                continue;
            }

            List<String> chosenIds = match.getIds().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .limit(MAX_SELECTED)
                    .collect(Collectors.toList());

            List<Product> picked = new ArrayList<>();
            for (String id : chosenIds) {
                // Preferir el orden que dijo el LLM
                options.stream()
                        .filter(p -> id.equals(p.getId()))
                        .findFirst()
                        .or(() -> {
                            Product fromCatalog = productCsvService.findById(id);
                            return fromCatalog != null ? java.util.Optional.of(fromCatalog) : java.util.Optional.empty();
                        })
                        .ifPresent(picked::add);
            }

            if (picked.isEmpty()) {
                picked = limit(options, FALLBACK_LIMIT);
            }

            cart.put(key, picked);
        }

        return cart;
    }

    /**
     * El LLM a menudo acorta el nombre ("jamón" vs "jamón york").
     * Empareja exacto, contiene, o token principal.
     */
    private ProductSelectionResponse.Selection findSelection(
            String ingredientKey,
            List<ProductSelectionResponse.Selection> selecciones) {

        String key = normalize(ingredientKey);

        // 1) exacto
        for (ProductSelectionResponse.Selection s : selecciones) {
            if (s.getIngrediente() == null) continue;
            if (key.equals(normalize(s.getIngrediente()))) {
                return s;
            }
        }

        // 2) uno contiene al otro ("jamón york" ↔ "jamón")
        ProductSelectionResponse.Selection best = null;
        int bestLen = -1;
        for (ProductSelectionResponse.Selection s : selecciones) {
            if (s.getIngrediente() == null) continue;
            String label = normalize(s.getIngrediente());
            if (label.isBlank()) continue;
            if (key.contains(label) || label.contains(key)) {
                if (label.length() > bestLen) {
                    best = s;
                    bestLen = label.length();
                }
            }
        }
        if (best != null) return best;

        // 3) mismo primer token (jamón / queso / pan)
        String keyToken = firstToken(key);
        if (!keyToken.isBlank()) {
            for (ProductSelectionResponse.Selection s : selecciones) {
                if (s.getIngrediente() == null) continue;
                if (keyToken.equals(firstToken(normalize(s.getIngrediente())))) {
                    return s;
                }
            }
        }

        return null;
    }

    private static List<Product> limit(List<Product> products, int n) {
        return products.stream().limit(n).collect(Collectors.toList());
    }

    private static String normalize(String text) {
        if (text == null) return "";
        String lower = text.toLowerCase(Locale.ROOT).trim();
        String decomposed = Normalizer.normalize(lower, Normalizer.Form.NFD);
        return decomposed.replaceAll("\\p{M}+", "");
    }

    private static String firstToken(String normalized) {
        if (normalized.isBlank()) return "";
        String[] parts = normalized.split("[^a-z0-9]+");
        return parts.length > 0 ? parts[0] : "";
    }
}

package com.mercadona.hackathon.service;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.catalog.repository.ProductRepository;
import com.mercadona.hackathon.model.MatchedProductResponse;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Ranking de ingredientes sobre el catálogo en PostgreSQL (no lee el CSV en runtime). El CSV solo
 * alimenta la DB vía perfil {@code demo}.
 */
@Service
public class IngredientMatchService {

  private static final Logger LOG = LoggerFactory.getLogger(IngredientMatchService.class);
  private static final int DEFAULT_LIMIT = 4;
  private static final int CANDIDATE_LIMIT = 8;

  private static final Map<String, List<String>> SYNONYMS =
      Map.ofEntries(
          Map.entry("jamon york", List.of("jamon cocido", "york")),
          Map.entry("jamon de york", List.of("jamon cocido", "york")),
          Map.entry("york", List.of("jamon cocido", "york")),
          Map.entry("jamon dulce", List.of("jamon cocido")),
          Map.entry("pan de molde", List.of("pan de molde", "pan")),
          Map.entry("carne picada", List.of("carne picada", "preparado de carne picada")),
          Map.entry("carne molida", List.of("carne picada", "preparado de carne picada")),
          Map.entry("macarrones", List.of("macarron")),
          Map.entry("espaguetis", List.of("espagueti", "spaghetti")),
          Map.entry("tomate frito", List.of("tomate frito")),
          Map.entry("aceite de oliva", List.of("aceite de oliva")));

  private static final Set<String> NON_FOOD_CATEGORY_MARKERS =
      Set.of(
          "limpieza",
          "limpiacristales",
          "limpihogar",
          "detergente",
          "lejia",
          "insecticida",
          "ambientador",
          "utensilios de limpieza",
          "papel higienico",
          "pilas",
          "bolsas de basura",
          "cuidado corporal",
          "cuidado e higiene",
          "higiene",
          "desodorante",
          "champu",
          "acondicionador",
          "depilacion",
          "afeitado",
          "maquillaje",
          "bases de maquillaje",
          "colorete",
          "labios",
          "ojos",
          "manicura",
          "perfume",
          "colonia",
          "protector solar",
          "parafarmacia",
          "fitoterapia",
          "coloracion cabello",
          "fijacion cabello",
          "gato",
          "perro",
          "biberon",
          "toallitas y panales",
          "velas",
          "decoracion",
          "pinceles",
          "menaje");

  private final ProductRepository productRepository;
  private volatile List<Product> cache = List.of();

  public IngredientMatchService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  /** Recarga el catálogo activo desde la DB (útil tras el import demo). */
  public synchronized void reload() {
    cache = productRepository.findAllByActiveTrue();
    LOG.info("Catálogo Laya cargado desde DB: {} productos activos.", cache.size());
  }

  public List<MatchedProductResponse> searchByIngredient(String keyword) {
    return searchByIngredient(keyword, DEFAULT_LIMIT);
  }

  public List<MatchedProductResponse> searchCandidates(String keyword) {
    return searchByIngredient(keyword, CANDIDATE_LIMIT);
  }

  public List<MatchedProductResponse> searchByIngredient(String keyword, int limit) {
    ensureCache();
    if (keyword == null || keyword.isBlank()) {
      return List.of();
    }

    String normalizedKeyword = normalize(keyword);
    List<String> queries = expandQueries(normalizedKeyword);
    if (queries.isEmpty()) {
      return List.of();
    }

    Map<Long, ScoredProduct> bestById = new LinkedHashMap<>();
    for (String query : queries) {
      List<String> tokens = tokenize(query);
      if (tokens.isEmpty()) {
        continue;
      }

      for (Product p : cache) {
        if (isNonFood(p)) {
          continue;
        }
        int s = score(p, query, tokens);
        if (s <= 0) {
          continue;
        }
        if (query.equals(normalizedKeyword)) {
          s += 25;
        }

        ScoredProduct prev = bestById.get(p.getId());
        if (prev == null || s > prev.score) {
          bestById.put(p.getId(), new ScoredProduct(p, s));
        }
      }
    }

    return bestById.values().stream()
        .sorted(
            Comparator.comparingInt((ScoredProduct sp) -> sp.score)
                .reversed()
                .thenComparing(sp -> sp.product.getName().length()))
        .limit(limit)
        .map(sp -> toResponse(sp.product))
        .collect(Collectors.toList());
  }

  /** Resuelve por id de DB o por sourceId (el que suele devolver el LLM). */
  public MatchedProductResponse findByAnyId(String id) {
    if (id == null || id.isBlank()) {
      return null;
    }
    ensureCache();
    try {
      long numeric = Long.parseLong(id.trim());
      return cache.stream()
          .filter(p -> p.getId().equals(numeric) || p.getSourceId().equals(numeric))
          .findFirst()
          .map(this::toResponse)
          .orElseGet(
              () ->
                  productRepository
                      .findById(numeric)
                      .or(() -> productRepository.findBySourceId(numeric))
                      .filter(Product::isActive)
                      .map(this::toResponse)
                      .orElse(null));
    } catch (NumberFormatException e) {
      return null;
    }
  }

  private void ensureCache() {
    if (cache.isEmpty()) {
      reload();
    }
  }

  private List<String> expandQueries(String normalizedKeyword) {
    List<String> queries = new ArrayList<>();
    queries.add(normalizedKeyword);

    List<String> synonyms = SYNONYMS.get(normalizedKeyword);
    if (synonyms != null) {
      for (String s : synonyms) {
        if (!queries.contains(s)) {
          queries.add(s);
        }
      }
    }
    return queries;
  }

  private boolean isNonFood(Product product) {
    String category = normalize(product.getCategory());
    String name = normalize(product.getName());

    for (String marker : NON_FOOD_CATEGORY_MARKERS) {
      if (category.contains(marker)) {
        return true;
      }
    }

    return name.contains("lavavajillas")
        || name.contains("ambientador")
        || name.contains("detergente")
        || name.contains("suavizante")
        || name.contains("limpiador")
        || name.contains("quitagrasas");
  }

  private int score(Product product, String keyword, List<String> tokens) {
    String name = normalize(product.getName());
    String category = normalize(product.getCategory());
    String subtitle = normalize(product.getSubtitle());

    boolean nameHasPhrase = containsWholePhrase(name, keyword);
    boolean categoryHasPhrase = containsWholePhrase(category, keyword);
    boolean nameHasAllTokens = tokens.stream().allMatch(t -> containsWholeWord(name, t));
    boolean categoryHasAllTokens = tokens.stream().allMatch(t -> containsWholeWord(category, t));

    if (!nameHasPhrase && !categoryHasPhrase && !nameHasAllTokens && !categoryHasAllTokens) {
      return -1;
    }

    int score = 0;

    if (name.equals(keyword)) {
      score += 1000;
    }
    if (name.startsWith(keyword + " ") || name.equals(keyword)) {
      score += 400;
    }
    if (nameHasPhrase) {
      score += 300;
    }
    if (categoryHasPhrase || categoryHasAllTokens) {
      score += 180;
    }
    if (nameHasAllTokens) {
      score += 80 * tokens.size();
    }

    int nameWords = name.isBlank() ? 0 : name.split("\\s+").length;
    score -= Math.max(0, nameWords - 2) * 12;

    if (nameHasPhrase && !name.startsWith(keyword) && nameWords >= 4) {
      score -= 40;
    }

    if (containsWholeWord(name, "lonchas")
        || containsWholeWord(category, "lonchas")
        || containsWholeWord(subtitle, "lonchas")) {
      score += 90;
    }
    if (containsWholeWord(name, "cocido") || containsWholeWord(category, "cocido")) {
      score += 50;
    }
    if (category.equals("verdura") || category.equals("fruta")) {
      score += 60;
    }

    if (subtitle.contains("kg") && (subtitle.contains("7") || subtitle.contains("pieza"))) {
      score -= 80;
    }
    if (name.contains("frito") && keyword.equals("tomate")) {
      score -= 120;
    }
    if (category.equals("tomate") && keyword.equals("tomate")) {
      score -= 70;
    }

    score += contextualAdjustments(keyword, tokens, name, category, subtitle);
    return score;
  }

  private int contextualAdjustments(
      String keyword, List<String> tokens, String name, String category, String subtitle) {
    int delta = 0;
    boolean meatQuery =
        keyword.contains("carne") || tokens.contains("picada") || tokens.contains("molida");
    boolean pastaMacQuery = keyword.contains("macarron") || tokens.contains("macarrones");
    boolean spicePimienta =
        keyword.equals("pimienta") || (tokens.size() == 1 && tokens.get(0).equals("pimienta"));
    boolean oilQuery = keyword.contains("aceite") && keyword.contains("oliva");

    if (meatQuery) {
      if (category.contains("marisco") || category.contains("pescado")) {
        delta -= 400;
      }
      if (category.contains("platos preparados") || category.contains("otras salsas")) {
        delta -= 250;
      }
      if (name.contains("carne de ") && !name.contains("picada")) {
        delta -= 350;
      }
      if (name.contains("preparado de carne picada") || name.contains("carne picada")) {
        delta += 280;
      }
      if (category.contains("hamburguesas y picadas")) {
        delta += 120;
      }
    }

    if (pastaMacQuery) {
      if (name.contains("macarron")) {
        delta += 350;
      }
      if (name.contains("penne")
          || name.contains("fusilli")
          || name.contains("tortiglioni")
          || name.contains("tiburon")
          || name.contains("estrellas")) {
        delta -= 200;
      }
      if (name.contains("macarrones con ") || category.contains("platos preparados")) {
        delta -= 300;
      }
    }

    if (oilQuery) {
      if (subtitle.contains("garrafa") || subtitle.contains("5 l") || subtitle.contains("3 l")) {
        delta -= 180;
      }
      if (subtitle.contains("botella") && subtitle.contains("1 l")) {
        delta += 100;
      }
    }

    if (spicePimienta) {
      if (category.contains("especias")) {
        delta += 150;
      }
      if (category.contains("embutido")) {
        delta -= 250;
      }
      if (name.contains("salsa")) {
        delta -= 120;
      }
    }

    if (keyword.equals("tomate") || tokens.contains("tomate")) {
      if (name.contains("triturado") || name.contains("tamizado")) {
        delta += 70;
      }
    }

    return delta;
  }

  private MatchedProductResponse toResponse(Product product) {
    return new MatchedProductResponse(
        product.getId(),
        product.getSourceId(),
        product.getName(),
        product.getCategory(),
        product.getSubtitle(),
        formatPrice(product.getPrice()),
        product.getMainImageUrl());
  }

  private static String formatPrice(BigDecimal price) {
    if (price == null) {
      return "";
    }
    return price.setScale(2).toPlainString().replace('.', ',') + " €";
  }

  private static String normalize(String text) {
    if (text == null) {
      return "";
    }
    String lower = text.toLowerCase(Locale.ROOT).trim();
    String decomposed = Normalizer.normalize(lower, Normalizer.Form.NFD);
    return decomposed.replaceAll("\\p{M}+", "");
  }

  private static List<String> tokenize(String normalized) {
    return Arrays.stream(normalized.split("[^a-z0-9]+"))
        .filter(t -> !t.isBlank())
        .collect(Collectors.toList());
  }

  private static boolean containsWholeWord(String haystack, String word) {
    if (haystack.isBlank() || word.isBlank()) {
      return false;
    }
    Pattern pattern = Pattern.compile("(?:^|[^a-z0-9])" + Pattern.quote(word) + "(?:[^a-z0-9]|$)");
    return pattern.matcher(haystack).find();
  }

  private static boolean containsWholePhrase(String haystack, String phrase) {
    if (haystack.isBlank() || phrase.isBlank()) {
      return false;
    }
    Pattern pattern =
        Pattern.compile("(?:^|[^a-z0-9])" + Pattern.quote(phrase) + "(?:[^a-z0-9]|$)");
    return pattern.matcher(haystack).find();
  }

  private static final class ScoredProduct {
    private final Product product;
    private final int score;

    private ScoredProduct(Product product, int score) {
      this.product = product;
      this.score = score;
    }
  }
}

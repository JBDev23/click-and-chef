package com.mercadona.hackathon.catalog.bootstrap;

import com.mercadona.hackathon.service.IngredientMatchService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/** Tras el import demo (si aplica), calienta la caché de matching de Laya. */
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class IngredientMatchCacheWarmer implements ApplicationRunner {
  private final IngredientMatchService matches;

  public IngredientMatchCacheWarmer(IngredientMatchService matches) {
    this.matches = matches;
  }

  @Override
  public void run(ApplicationArguments args) {
    matches.reload();
  }
}

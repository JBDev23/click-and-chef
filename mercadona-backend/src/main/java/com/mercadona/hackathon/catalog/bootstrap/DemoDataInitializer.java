package com.mercadona.hackathon.catalog.bootstrap;

import com.mercadona.hackathon.catalog.service.DemoDataService;
import com.mercadona.hackathon.catalog.service.ProductImportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@Profile("demo")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DemoDataInitializer implements ApplicationRunner {
  private static final Logger LOG = LoggerFactory.getLogger(DemoDataInitializer.class);
  private final ProductImportService importer;
  private final DemoDataService demo;
  private final Resource resource;

  public DemoDataInitializer(
      ProductImportService importer,
      DemoDataService demo,
      @Value("${app.catalog.import-resource}") Resource resource) {
    this.importer = importer;
    this.demo = demo;
    this.resource = resource;
  }

  @Override
  public void run(ApplicationArguments args) {
    int count = importer.importCsv(resource);
    demo.seed();
    LOG.info("Catálogo de demostración preparado: {} productos.", count);
  }
}

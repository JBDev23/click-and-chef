package com.mercadona.hackathon.catalog.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductImportService {
  private final JdbcTemplate jdbc;
  private static final String UPSERT =
      """
      INSERT INTO product (source_id, name, category, subtitle, price, discount_price,
          main_image_url, secondary_image_url, nutritional_info)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (source_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category,
          subtitle = EXCLUDED.subtitle, price = EXCLUDED.price, discount_price = EXCLUDED.discount_price,
          main_image_url = EXCLUDED.main_image_url, secondary_image_url = EXCLUDED.secondary_image_url,
          nutritional_info = EXCLUDED.nutritional_info
      """;

  public ProductImportService(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  @Transactional
  public int importCsv(Resource resource) {
    List<ImportedProduct> rows = read(resource);
    jdbc.batchUpdate(
        UPSERT,
        rows,
        500,
        (statement, row) -> {
          statement.setLong(1, row.sourceId());
          statement.setString(2, row.name());
          statement.setString(3, row.category());
          statement.setString(4, row.subtitle());
          statement.setBigDecimal(5, row.price());
          statement.setBigDecimal(6, row.discountPrice());
          statement.setString(7, row.mainImage());
          statement.setString(8, row.secondaryImage());
          statement.setString(9, row.nutritionalInfo());
        });
    return rows.size();
  }

  private List<ImportedProduct> read(Resource resource) {
    try (BufferedReader reader =
        new BufferedReader(
            new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
      reader.mark(1);
      if (reader.read() != '\uFEFF') reader.reset();
      try (CSVParser parser =
          CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).get().parse(reader)) {
        Set<String> required =
            Set.of(
                "id",
                "Category",
                "name",
                "subtitle",
                "price",
                "discount_price",
                "main_image_url",
                "secondary_image_url",
                "nutritional_info");
        if (!parser.getHeaderMap().keySet().containsAll(required))
          throw new IllegalArgumentException("El CSV no contiene las columnas requeridas.");
        List<ImportedProduct> rows = new ArrayList<>();
        Set<Long> ids = new HashSet<>();
        for (CSVRecord record : parser) {
          try {
            if (!record.isConsistent())
              throw new IllegalArgumentException("Número de columnas incorrecto.");
            long id = Long.parseLong(record.get("id").strip());
            if (id <= 0 || !ids.add(id))
              throw new IllegalArgumentException("Identificador inválido o duplicado.");
            String name = record.get("name").strip();
            if (name.isEmpty()) throw new IllegalArgumentException("Nombre vacío.");
            rows.add(
                new ImportedProduct(
                    id,
                    name,
                    record.get("Category"),
                    record.get("subtitle"),
                    parsePrice(record.get("price")),
                    record.get("discount_price").isBlank()
                        ? null
                        : parsePrice(record.get("discount_price")),
                    record.get("main_image_url"),
                    record.get("secondary_image_url"),
                    record.get("nutritional_info")));
          } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                "Fila CSV " + record.getRecordNumber() + ": " + exception.getMessage(), exception);
          }
        }
        if (rows.isEmpty()) throw new IllegalArgumentException("El catálogo está vacío.");
        return rows;
      }
    } catch (IOException exception) {
      throw new IllegalArgumentException("No se puede leer el catálogo CSV.", exception);
    }
  }

  private BigDecimal parsePrice(String input) {
    String value = input.replace("€", "").replace("\u00a0", "").strip();
    if (!value.matches("\\d+(?:,\\d{1,2})?"))
      throw new IllegalArgumentException("Precio inválido.");
    BigDecimal price = new BigDecimal(value.replace(',', '.')).setScale(2);
    if (price.precision() > 10) throw new IllegalArgumentException("Precio fuera de rango.");
    return price;
  }

  private record ImportedProduct(
      long sourceId,
      String name,
      String category,
      String subtitle,
      BigDecimal price,
      BigDecimal discountPrice,
      String mainImage,
      String secondaryImage,
      String nutritionalInfo) {}
}

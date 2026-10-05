package com.mercadona.hackathon.model;

import java.util.List;
import lombok.Data;

@Data
public class ProductSelectionResponse {
  private List<Selection> selecciones;

  @Data
  public static class Selection {
    private String ingrediente;
    private List<String> ids;
  }
}

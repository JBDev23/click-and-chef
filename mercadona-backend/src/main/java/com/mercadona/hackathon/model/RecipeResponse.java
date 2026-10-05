package com.mercadona.hackathon.model;

import java.util.List;
import lombok.Data;

@Data
public class RecipeResponse {
  private String decision;
  private String plato;
  private List<String> ingredientes;
}

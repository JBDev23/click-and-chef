package com.mercadona.hackathon.model;

import lombok.Data;
import java.util.List;

@Data
public class RecipeResponse {
    private String decision;
    private String plato;
    private List<String> ingredientes;
}

package com.mercadona.hackathon.model;

import lombok.Data;
import java.util.List;

@Data
public class ProductSelectionResponse {
    private List<Selection> selecciones;

    @Data
    public static class Selection {
        private String ingrediente;
        private List<String> ids;
    }
}

package com.mercadona.hackathon.model;

import lombok.Data;

@Data
public class Product {
    private String id;
    private String category;
    private String name;
    private String subtitle;
    private String price;
    private String mainImageUrl;
}

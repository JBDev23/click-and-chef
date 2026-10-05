package com.mercadona.hackathon.model;

/** Producto del catálogo (DB) expuesto a Laya / n8n. */
public record MatchedProductResponse(
    Long id,
    Long sourceId,
    String name,
    String category,
    String subtitle,
    String price,
    String mainImageUrl) {}

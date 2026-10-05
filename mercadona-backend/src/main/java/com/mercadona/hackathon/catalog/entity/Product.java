package com.mercadona.hackathon.catalog.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private Long sourceId;

  @Column(nullable = false, columnDefinition = "text")
  private String name;

  @Column(nullable = false, columnDefinition = "text")
  private String category;

  @Column(nullable = false, columnDefinition = "text")
  private String subtitle;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(precision = 10, scale = 2)
  private BigDecimal discountPrice;

  @Column(columnDefinition = "text")
  private String mainImageUrl;

  @Column(columnDefinition = "text")
  private String secondaryImageUrl;

  @Column(columnDefinition = "text")
  private String nutritionalInfo;

  @Column(nullable = false)
  private boolean active = true;

  @Column(nullable = false)
  private boolean drinkEligible;

  @Column(nullable = false)
  private boolean dessertEligible;

  @Column(precision = 10, scale = 2)
  private BigDecimal servingPrice;

  @Column(columnDefinition = "text")
  private String servingFormat;

  public boolean isEligible(ProductRole role) {
    return active
        && servingPrice != null
        && (role == ProductRole.DRINK ? drinkEligible : dessertEligible);
  }

  public void configureComplement(ProductRole role, BigDecimal unitPrice, String format) {
    if (role == ProductRole.DRINK) drinkEligible = true;
    else dessertEligible = true;
    servingPrice = unitPrice;
    servingFormat = format;
  }
}

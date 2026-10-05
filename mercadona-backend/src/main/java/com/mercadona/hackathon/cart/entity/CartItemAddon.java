package com.mercadona.hackathon.cart.entity;

import com.mercadona.hackathon.catalog.entity.Product;
import com.mercadona.hackathon.catalog.entity.ProductRole;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_item_addon")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItemAddon {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_item_id")
  private CartItem item;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id")
  private Product product;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private ProductRole type;

  @Column(nullable = false, columnDefinition = "text")
  private String productName;

  @Column(nullable = false, columnDefinition = "text")
  private String servingFormat;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  public CartItemAddon(CartItem item, Product product, ProductRole type) {
    this.item = item;
    this.product = product;
    this.type = type;
    this.productName = product.getName();
    this.servingFormat = product.getServingFormat();
    this.price = product.getServingPrice();
  }
}

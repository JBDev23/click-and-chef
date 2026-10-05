package com.mercadona.hackathon.cart.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 64)
  private String tokenHash;

  @Column(nullable = false)
  private Instant createdAt;

  @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("id ASC")
  private List<CartItem> items = new ArrayList<>();

  public Cart(String tokenHash) {
    this.tokenHash = tokenHash;
    this.createdAt = Instant.now();
  }

  public void add(CartItem item) {
    items.add(item);
  }

  public void remove(CartItem item) {
    items.remove(item);
  }
}

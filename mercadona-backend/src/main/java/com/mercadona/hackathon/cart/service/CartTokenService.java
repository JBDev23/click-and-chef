package com.mercadona.hackathon.cart.service;

import com.mercadona.hackathon.cart.entity.Cart;
import com.mercadona.hackathon.common.exception.ApiException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import org.springframework.stereotype.Component;

@Component
public class CartTokenService {
  private final SecureRandom random = new SecureRandom();

  public String generate() {
    byte[] bytes = new byte[32];
    random.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  public String hash(String token) {
    try {
      return HexFormat.of()
          .formatHex(
              MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException exception) {
      throw new IllegalStateException("SHA-256 no está disponible.", exception);
    }
  }

  public void verify(Cart cart, String token) {
    if (token == null
        || !token.matches("[A-Za-z0-9_-]{43}")
        || !MessageDigest.isEqual(
            cart.getTokenHash().getBytes(StandardCharsets.US_ASCII),
            hash(token).getBytes(StandardCharsets.US_ASCII))) throw ApiException.forbidden();
  }
}

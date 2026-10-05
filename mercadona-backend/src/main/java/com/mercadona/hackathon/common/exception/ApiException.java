package com.mercadona.hackathon.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
  private final HttpStatus status;
  private final String code;

  public ApiException(HttpStatus status, String code, String detail) {
    super(detail);
    this.status = status;
    this.code = code;
  }

  public static ApiException invalid(String detail) {
    return new ApiException(HttpStatus.BAD_REQUEST, "INVALID_CONFIGURATION", detail);
  }

  public static ApiException missing(String detail) {
    return new ApiException(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", detail);
  }

  public static ApiException forbidden() {
    return new ApiException(
        HttpStatus.FORBIDDEN, "INVALID_CART_TOKEN", "El token del carrito no es válido.");
  }
}

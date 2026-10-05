package com.mercadona.hackathon.common.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class Money {
  public static final BigDecimal ZERO = new BigDecimal("0.00");

  private Money() {}

  public static BigDecimal round(BigDecimal value) {
    return value.setScale(2, RoundingMode.HALF_UP);
  }

  public static String format(BigDecimal value) {
    return round(value).toPlainString();
  }
}

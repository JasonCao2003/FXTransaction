package com.alxy.accountservice.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ExchangeRateView {
    LocalDate getDate();
    BigDecimal getExchangeRate();
}

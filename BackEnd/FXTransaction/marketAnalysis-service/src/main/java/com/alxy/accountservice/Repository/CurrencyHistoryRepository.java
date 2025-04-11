package com.alxy.accountservice.Repository;

import com.alxy.accountservice.DTO.ExchangeRateView;
import com.alxy.accountservice.Entity.CurrencyHistory;
import feign.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CurrencyHistoryRepository extends JpaRepository<CurrencyHistory, String> {


    // 根据基础货币、目标货币和日期范围查询历史汇率记录
    List<ExchangeRateView> findByBaseCurrencyAndTargetCurrencyAndDateBetween(
            String baseCurrency,
            String targetCurrency,
            LocalDate startDate,
            LocalDate endDate
    );

    List<CurrencyHistory> findCurrencyHistoriesByDateAndBaseCurrency(LocalDate date, String baseCurrency);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO currency_exchange_history (exchange_id, base_currency, target_currency, exchange_rate, high, low, open, close, date) " +
            "VALUES (:#{#currencyHistory.exchangeId}, :#{#currencyHistory.baseCurrency}, :#{#currencyHistory.targetCurrency}, :#{#currencyHistory.exchangeRate}, " +
            ":#{#currencyHistory.high}, :#{#currencyHistory.low}, :#{#currencyHistory.open}, :#{#currencyHistory.close}, :#{#currencyHistory.date})",
            nativeQuery = true)
    void addCurrencyHistory(@Param("currencyHistory") CurrencyHistory currencyHistory);
}

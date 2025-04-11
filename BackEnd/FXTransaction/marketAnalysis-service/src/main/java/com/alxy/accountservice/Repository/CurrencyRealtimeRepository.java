package com.alxy.accountservice.Repository;

import com.alxy.accountservice.Entity.CurrencyRealtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyRealtimeRepository extends JpaRepository<CurrencyRealtime, String> {
}

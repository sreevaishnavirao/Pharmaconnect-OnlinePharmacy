package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.StockAlertLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockAlertLogRepository extends JpaRepository<StockAlertLog, Long> {
    Optional<StockAlertLog> findByProductId(Long productId);
}

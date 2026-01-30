package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.ProductDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProductDetailsRepository extends JpaRepository<ProductDetails, Long> {

    Optional<ProductDetails> findByProduct_ProductId(Long productId);

    List<ProductDetails> findByExpiryDateBetween(LocalDate start, LocalDate end);
    @Query("""
        SELECT d
        FROM ProductDetails d
        WHERE d.expiryDate BETWEEN :start AND :end
          AND (d.expiryAlertSentOn IS NULL OR d.expiryAlertSentOn <> :today)
    """)
    List<ProductDetails> findExpiringNotAlertedToday(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("today") LocalDate today
    );
}

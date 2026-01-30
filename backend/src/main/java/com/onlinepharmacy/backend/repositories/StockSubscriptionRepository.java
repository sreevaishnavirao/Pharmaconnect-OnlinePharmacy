package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.StockSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockSubscriptionRepository extends JpaRepository<StockSubscription, Long> {

    Optional<StockSubscription> findByProductIdAndEmail(Long productId, String email);
    List<StockSubscription> findByProductIdAndNotifiedFalse(Long productId);
    long countByProductIdAndNotifiedFalse(Long productId);
}


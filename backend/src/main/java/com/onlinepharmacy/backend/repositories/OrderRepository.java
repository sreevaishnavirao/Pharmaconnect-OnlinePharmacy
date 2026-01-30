package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByEmail(String email, Pageable pageable);
    @Query("select coalesce(sum(o.totalAmount), 0) from Order o")
    Double getTotalRevenue();
}

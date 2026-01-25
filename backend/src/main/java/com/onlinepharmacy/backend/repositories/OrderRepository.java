package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ because you store: order.setEmail(emailId)
    Page<Order> findByEmail(String email, Pageable pageable);

    // ✅ total revenue = sum of totalAmount from Order table
    @Query("select coalesce(sum(o.totalAmount), 0) from Order o")
    Double getTotalRevenue();
}

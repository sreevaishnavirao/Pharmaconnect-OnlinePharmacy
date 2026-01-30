package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder_OrderId(Long orderId);
    @Query("""
           select oi
           from OrderItem oi
           join fetch oi.product p
           join fetch oi.order o
           where o.orderId in :orderIds
           """)
    List<OrderItem> findAllByOrderIdsWithProduct(@Param("orderIds") List<Long> orderIds);
    @Query("""
           select oi
                    
           from OrderItem oi
           join fetch oi.product p
           join fetch oi.order o
           where o.orderId = :orderId
           """)
    List<OrderItem> findAllByOrderIdWithProduct(@Param("orderId") Long orderId);
}

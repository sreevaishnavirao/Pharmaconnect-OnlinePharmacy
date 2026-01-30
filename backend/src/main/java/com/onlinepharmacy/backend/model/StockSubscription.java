package com.onlinepharmacy.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "stock_subscriptions",

        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "email"})
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class StockSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="product_id", nullable = false)
    private Long productId;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private boolean notified = false;
    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

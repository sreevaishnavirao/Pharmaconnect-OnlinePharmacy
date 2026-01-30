package com.onlinepharmacy.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_alert_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class StockAlertLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="product_id", nullable = false, unique = true)
    private Long productId;
    @Column(name="last_alert_at")
    private LocalDateTime lastAlertAt;
    @Column(name="last_quantity")
    private Integer lastQuantity;
}


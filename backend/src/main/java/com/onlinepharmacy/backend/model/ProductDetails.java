package com.onlinepharmacy.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "product_details",
        uniqueConstraints = @UniqueConstraint(columnNames = "product_id")
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProductDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(columnDefinition = "TEXT")
    private String ingredients;
    @Column(columnDefinition = "TEXT")
    private String usageDosage;
    @Column(columnDefinition = "TEXT")
    private String storageInfo;
    @Column(columnDefinition = "TEXT")
    private String sideEffects;
    private LocalDate expiryDate;
    private LocalDate expiryAlertSentOn;

}

package com.onlinepharmacy.backend.payload;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailsResponse {
    private Long productId;
    private String ingredients;
    private String usageDosage;
    private String storageInfo;
    private String sideEffects;
    private LocalDate expiryDate;
}

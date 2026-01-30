package com.onlinepharmacy.backend.payload;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductDetailsRequest {
    private String ingredients;
    private String usageDosage;
    private String storageInfo;
    private String sideEffects;
    private LocalDate expiryDate;
}

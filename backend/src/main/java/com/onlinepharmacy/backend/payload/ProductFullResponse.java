package com.onlinepharmacy.backend.payload;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductFullResponse {
    private ProductDTO product;
    private ProductDetailsResponse details;
}

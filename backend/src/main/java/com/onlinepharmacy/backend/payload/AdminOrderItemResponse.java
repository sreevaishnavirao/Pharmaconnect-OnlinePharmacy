package com.onlinepharmacy.backend.payload;

import lombok.Data;

@Data
public class AdminOrderItemResponse {
    private Long orderItemId;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private double discount;
    private double orderedProductPrice;
    private Double specialPrice;
}

package com.onlinepharmacy.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderResponse {
    private Long orderId;
    private String email;
    private String orderDate;
    private String orderStatus;
    private Double totalAmount;
}


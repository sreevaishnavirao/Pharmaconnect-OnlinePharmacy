package com.onlinepharmacy.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderResponse {
    private Long orderId;
    private String email;        // customer
    private String orderDate;    // string for easy frontend render
    private String orderStatus;
    private Double totalAmount;
}


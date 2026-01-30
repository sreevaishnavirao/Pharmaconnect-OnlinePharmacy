package com.onlinepharmacy.backend.payload;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class AdminOrderDetailsResponse {
    private Long orderId;
    private String email;
    private String orderDate;
    private String orderStatus;
    private Double totalAmount;

    private List<AdminOrderItemResponse> items = new ArrayList<>();
}

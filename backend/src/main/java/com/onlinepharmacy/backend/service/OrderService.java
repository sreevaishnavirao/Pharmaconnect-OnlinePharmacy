package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.payload.OrderDTO;
import com.onlinepharmacy.backend.payload.OrderResponseDTO;

public interface OrderService {

    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod,
                        String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);

    // ✅ NEW
    OrderResponseDTO getAllOrders(Integer pageNumber, Integer pageSize);

    // ✅ NEW
    OrderResponseDTO getOrdersByEmail(String email, Integer pageNumber, Integer pageSize);
}

package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.payload.AdminOrderDetailsResponse;
import com.onlinepharmacy.backend.payload.AdminOrderPageResponse;

public interface AdminOrderService {

    AdminOrderPageResponse getAllOrders(Integer pageNumber,
                                        Integer pageSize,
                                        String sortBy,
                                        String sortOrder);
    AdminOrderDetailsResponse getOrderDetails(Long orderId);
}

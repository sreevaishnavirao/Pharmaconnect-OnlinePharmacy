package com.onlinepharmacy.backend.controller;

import com.onlinepharmacy.backend.payload.AdminOrderDetailsResponse;
import com.onlinepharmacy.backend.payload.AdminOrderPageResponse;
import com.onlinepharmacy.backend.service.AdminOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final AdminOrderService adminOrderService;
    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }
    @GetMapping
    public ResponseEntity<AdminOrderPageResponse> getAllOrders(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "orderId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder
    ) {
        return ResponseEntity.ok(
                adminOrderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder)
        );
    }
    @GetMapping("/{orderId}")
    public ResponseEntity<AdminOrderDetailsResponse> getOrderDetails(@PathVariable Long orderId) {
        return ResponseEntity.ok(adminOrderService.getOrderDetails(orderId));
    }
}

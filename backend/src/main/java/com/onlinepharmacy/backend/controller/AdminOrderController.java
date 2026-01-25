package com.onlinepharmacy.backend.controller;

import com.onlinepharmacy.backend.model.Order;
import com.onlinepharmacy.backend.payload.AdminOrderPageResponse;
import com.onlinepharmacy.backend.payload.AdminOrderResponse;
import com.onlinepharmacy.backend.repositories.OrderRepository;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderRepository orderRepository;

    public AdminOrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<AdminOrderPageResponse> getAllOrders(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "orderId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder
    ) {

        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Order> page = orderRepository.findAll(pageable);

        List<AdminOrderResponse> content = page.getContent().stream()
                .map(o -> new AdminOrderResponse(
                        o.getOrderId(),
                        o.getEmail(),
                        o.getOrderDate() != null ? o.getOrderDate().toString() : null,
                        o.getOrderStatus(),
                        o.getTotalAmount()
                ))
                .toList();

        AdminOrderPageResponse resp = new AdminOrderPageResponse();
        resp.setContent(content);
        resp.setPageNumber(page.getNumber());
        resp.setPageSize(page.getSize());
        resp.setTotalElements(page.getTotalElements());
        resp.setTotalPages(page.getTotalPages());
        resp.setLastPage(page.isLast());

        return ResponseEntity.ok(resp);
    }
}


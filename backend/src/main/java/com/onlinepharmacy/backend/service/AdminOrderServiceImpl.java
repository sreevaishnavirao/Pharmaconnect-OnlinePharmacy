package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.exceptions.ResourceNotFoundException;
import com.onlinepharmacy.backend.model.Order;
import com.onlinepharmacy.backend.model.OrderItem;
import com.onlinepharmacy.backend.model.Product;
import com.onlinepharmacy.backend.payload.AdminOrderDetailsResponse;
import com.onlinepharmacy.backend.payload.AdminOrderItemResponse;
import com.onlinepharmacy.backend.payload.AdminOrderPageResponse;
import com.onlinepharmacy.backend.payload.AdminOrderResponse;
import com.onlinepharmacy.backend.repositories.OrderItemRepository;
import com.onlinepharmacy.backend.repositories.OrderRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    public AdminOrderServiceImpl(OrderRepository orderRepository,
                                 OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }
    @Override
    public AdminOrderPageResponse getAllOrders(Integer pageNumber,
                                               Integer pageSize,
                                               String sortBy,
                                               String sortOrder) {
        int page = (pageNumber == null || pageNumber < 0) ? 0 : pageNumber;
        int size = (pageSize == null || pageSize <= 0) ? 10 : pageSize;

        String safeSortBy = (sortBy == null || sortBy.isBlank()) ? "orderId" : sortBy.trim();
        String safeSortOrder = (sortOrder == null || sortOrder.isBlank()) ? "desc" : sortOrder.trim().toLowerCase();
        Sort sort = safeSortOrder.equals("asc")
                ? Sort.by(safeSortBy).ascending()
                : Sort.by(safeSortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Order> ordersPage = orderRepository.findAll(pageable);
        List<AdminOrderResponse> content = ordersPage.getContent().stream()
                .map(this::toAdminOrderResponse)
                .collect(Collectors.toList());
        AdminOrderPageResponse resp = new AdminOrderPageResponse();
        resp.setContent(content);
        resp.setPageNumber(ordersPage.getNumber());
        resp.setPageSize(ordersPage.getSize());
        resp.setTotalElements(ordersPage.getTotalElements());
        resp.setTotalPages(ordersPage.getTotalPages());
        resp.setLastPage(ordersPage.isLast());

        return resp;
    }
    private AdminOrderResponse toAdminOrderResponse(Order o) {
        String dateStr = "";
        LocalDate d = o.getOrderDate();
        if (d != null) dateStr = d.format(DATE_FMT);

        return new AdminOrderResponse(
                o.getOrderId(),
                o.getEmail(),
                dateStr,
                o.getOrderStatus(),
                o.getTotalAmount()
        );
    }
    @Override
    public AdminOrderDetailsResponse getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        List<?> rawItems = orderItemRepository.findByOrder_OrderId(orderId);
        List<AdminOrderItemResponse> itemResponses = (rawItems == null ? List.of() : rawItems)
                .stream()
                .filter(Objects::nonNull)
                .filter(x -> x instanceof OrderItem)
                .map(x -> toItemResponse((OrderItem) x))
                .collect(Collectors.toList());

        String dateStr = "";
        if (order.getOrderDate() != null) {
            dateStr = order.getOrderDate().format(DATE_FMT);
        }
        AdminOrderDetailsResponse resp = new AdminOrderDetailsResponse();
        resp.setOrderId(order.getOrderId());
        resp.setEmail(order.getEmail());
        resp.setOrderDate(dateStr);
        resp.setOrderStatus(order.getOrderStatus());
        resp.setTotalAmount(order.getTotalAmount());
        resp.setItems(itemResponses);
        return resp;
    }

    private AdminOrderItemResponse toItemResponse(OrderItem it) {
        Product p = it.getProduct();

        AdminOrderItemResponse r = new AdminOrderItemResponse();
        r.setOrderItemId(it.getOrderItemId());
        r.setQuantity(it.getQuantity());
        r.setDiscount(it.getDiscount());
        r.setOrderedProductPrice(it.getOrderedProductPrice());
        if (p != null) {
            r.setProductId(p.getProductId());
            r.setProductName(p.getProductName());
            r.setProductImage(p.getImage());
            r.setSpecialPrice(p.getSpecialPrice());
        } else {
            r.setProductId(null);
            r.setProductName("Unknown");
            r.setProductImage(null);
            r.setSpecialPrice(0.0);
        }

        return r;
    }
}

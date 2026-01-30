package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.exceptions.APIException;
import com.onlinepharmacy.backend.exceptions.ResourceNotFoundException;
import com.onlinepharmacy.backend.model.*;
import com.onlinepharmacy.backend.payload.OrderDTO;
import com.onlinepharmacy.backend.payload.OrderItemDTO;
import com.onlinepharmacy.backend.payload.OrderResponseDTO;
import com.onlinepharmacy.backend.repositories.*;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired private CartRepository cartRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private CartService cartService;
    @Autowired private ModelMapper modelMapper;
    @Autowired private ProductRepository productRepository;

    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName,
                               String pgPaymentId, String pgStatus, String pgResponseMessage) {

        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) throw new ResourceNotFoundException("Cart", "email", emailId);

        List<CartItem> cartItems = cart.getCartItems();
        if (cartItems == null || cartItems.isEmpty()) throw new APIException("Cart is empty");

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus("Order Accepted !");
        order.setAddress(address);

        Payment payment = new Payment(paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);
        Order savedOrder = orderRepository.save(order);
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setProduct(cartItem.getProduct());
            oi.setQuantity(cartItem.getQuantity());
            oi.setDiscount(cartItem.getDiscount());
            oi.setOrderedProductPrice(cartItem.getProductPrice());
            oi.setOrder(savedOrder);
            orderItems.add(oi);
        }
        orderItems = orderItemRepository.saveAll(orderItems);


        for (CartItem item : cartItems) {
            int qty = item.getQuantity();
            Product product = item.getProduct();

            int current = product.getQuantity() == null ? 0 : product.getQuantity();
            product.setQuantity(current - qty);
            productRepository.save(product);

            cartService.deleteProductFromCart(cart.getCartId(), product.getProductId());
        }

        return buildOrderDTO(savedOrder, orderItems);
    }


    @Override
    @Transactional
    public OrderResponseDTO getAllOrders(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("orderId").descending());
        Page<Order> page = orderRepository.findAll(pageable);

        List<OrderDTO> content = attachItemsAndMap(page.getContent());
        return new OrderResponseDTO(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }


    @Override
    @Transactional
    public OrderResponseDTO getOrdersByEmail(String email, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("orderId").descending());
        Page<Order> page = orderRepository.findByEmail(email, pageable);

        List<OrderDTO> content = attachItemsAndMap(page.getContent());
        System.out.println("DEBUG_ADMIN_ORDERS: firstOrderItemsCount = " +
                (content.isEmpty() ? "no-orders" :
                        (content.get(0).getOrderItems() == null ? "NULL" : content.get(0).getOrderItems().size())
                )
        );


        return new OrderResponseDTO(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }


    private List<OrderDTO> attachItemsAndMap(List<Order> orders) {
        if (orders == null || orders.isEmpty()) return List.of();

        List<Long> orderIds = orders.stream()
                .map(Order::getOrderId)
                .filter(Objects::nonNull)
                .toList();


        List<OrderItem> allItems = orderItemRepository.findAllByOrderIdsWithProduct(orderIds);

        Map<Long, List<OrderItem>> itemsByOrderId = allItems.stream()
                .filter(oi -> oi.getOrder() != null && oi.getOrder().getOrderId() != null)
                .collect(Collectors.groupingBy(oi -> oi.getOrder().getOrderId()));

        List<OrderDTO> dtos = new ArrayList<>();

        for (Order o : orders) {
            OrderDTO dto = modelMapper.map(o, OrderDTO.class);

            List<OrderItem> items = itemsByOrderId.getOrDefault(o.getOrderId(), List.of());


            List<OrderItemDTO> itemDTOs = items.stream()
                    .map(it -> modelMapper.map(it, OrderItemDTO.class))
                    .collect(Collectors.toList());

            dto.setOrderItems(itemDTOs);

            if (o.getAddress() != null) dto.setAddressId(o.getAddress().getAddressId());

            dtos.add(dto);
        }

        return dtos;
    }

    private OrderDTO buildOrderDTO(Order order, List<OrderItem> orderItems) {
        OrderDTO dto = modelMapper.map(order, OrderDTO.class);

        List<OrderItemDTO> items = (orderItems == null ? List.of() : orderItems)
                .stream()
                .map(it -> modelMapper.map(it, OrderItemDTO.class))
                .collect(Collectors.toList());

        dto.setOrderItems(items);

        if (order.getAddress() != null) dto.setAddressId(order.getAddress().getAddressId());

        return dto;
    }
}

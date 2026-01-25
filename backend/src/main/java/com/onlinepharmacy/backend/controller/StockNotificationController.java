package com.onlinepharmacy.backend.controller;

import com.onlinepharmacy.backend.payload.StockSubscribeRequest;
import com.onlinepharmacy.backend.service.StockNotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/products")
public class StockNotificationController {

    private final StockNotificationService stockNotificationService;

    public StockNotificationController(StockNotificationService stockNotificationService) {
        this.stockNotificationService = stockNotificationService;
    }

    // POST /api/public/products/{productId}/notify
    @PostMapping("/{productId}/notify")
    public ResponseEntity<String> subscribe(@PathVariable Long productId,
                                            @Valid @RequestBody StockSubscribeRequest req) {
        stockNotificationService.subscribe(productId, req.getEmail());
        return ResponseEntity.ok("Subscribed for back-in-stock notification");
    }
}

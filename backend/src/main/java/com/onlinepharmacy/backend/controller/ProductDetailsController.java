package com.onlinepharmacy.backend.controller;

import com.onlinepharmacy.backend.payload.ProductDetailsRequest;
import com.onlinepharmacy.backend.payload.ProductDetailsResponse;
import com.onlinepharmacy.backend.payload.ProductFullResponse;
import com.onlinepharmacy.backend.service.ProductDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProductDetailsController {

    private final ProductDetailsService service;
    public ProductDetailsController(ProductDetailsService service) {
        this.service = service;
    }
    @GetMapping("/public/products/{id}/details")
    public ResponseEntity<ProductDetailsResponse> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDetails(id));
    }
    @GetMapping("/public/products/{id}/full")
    public ResponseEntity<ProductFullResponse> getFull(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProductFull(id));
    }
    @PutMapping("/admin/products/{id}/details")
    public ResponseEntity<ProductDetailsResponse> upsertDetails(
            @PathVariable Long id,
            @RequestBody ProductDetailsRequest req
    ) {return ResponseEntity.ok(service.upsertDetails(id, req));
    }
}

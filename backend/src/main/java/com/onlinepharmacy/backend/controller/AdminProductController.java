package com.onlinepharmacy.backend.controller;

import com.onlinepharmacy.backend.model.Category;
import com.onlinepharmacy.backend.model.Product;
import com.onlinepharmacy.backend.payload.AdminProductResponse;
import com.onlinepharmacy.backend.payload.ProductDTO;
import com.onlinepharmacy.backend.payload.ProductRequest;
import com.onlinepharmacy.backend.repositories.CategoryRepository;
import com.onlinepharmacy.backend.repositories.ProductRepository;
import com.onlinepharmacy.backend.service.ProductService;
import com.onlinepharmacy.backend.service.StockNotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductService productService;
    private final StockNotificationService stockNotificationService;

    public AdminProductController(ProductRepository productRepository,
                                  CategoryRepository categoryRepository,
                                  ProductService productService,
                                  com.onlinepharmacy.backend.service.StockNotificationService stockNotificationService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productService = productService;
        this.stockNotificationService = stockNotificationService;
    }

    private AdminProductResponse toResponse(Product p) {
        return new AdminProductResponse(
                p.getProductId(),
                p.getProductName(),
                p.getImage(),
                p.getDescription(),
                p.getQuantity(),
                p.getPrice(),
                p.getDiscount(),
                p.getSpecialPrice(),
                p.getCategory() != null ? p.getCategory().getCategoryId() : null,
                p.getCategory() != null ? p.getCategory().getCategoryName() : null
        );
    }

    @GetMapping
    public ResponseEntity<List<AdminProductResponse>> getAll(@RequestParam(required = false) Long categoryId) {
        List<Product> products = (categoryId == null)
                ? productRepository.findAll()
                : productRepository.findByCategory_CategoryId(categoryId);

        return ResponseEntity.ok(products.stream().map(this::toResponse).toList());
    }

    @PostMapping
    public ResponseEntity<AdminProductResponse> create(@Valid @RequestBody ProductRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + req.getCategoryId()));

        Product p = new Product();
        p.setProductName(req.getProductName());
        p.setImage((req.getImage() != null && !req.getImage().isBlank()) ? req.getImage() : "default.png");
        p.setDescription(req.getDescription());
        p.setQuantity(req.getQuantity());
        p.setPrice(req.getPrice());

        double discount = (req.getDiscount() != null) ? req.getDiscount() : 0.0;
        p.setDiscount(discount);

        double specialPrice = (req.getSpecialPrice() != null)
                ? req.getSpecialPrice()
                : (req.getPrice() - ((discount * 0.01) * req.getPrice()));
        p.setSpecialPrice(specialPrice);

        p.setCategory(category);

        Product saved = productRepository.save(p);
        return ResponseEntity.ok(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        int oldQty = existing.getQuantity() == null ? 0 : existing.getQuantity();

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + req.getCategoryId()));

        existing.setProductName(req.getProductName());
        existing.setDescription(req.getDescription());
        existing.setQuantity(req.getQuantity());
        existing.setPrice(req.getPrice());

        if (req.getImage() != null && !req.getImage().isBlank()) {
            existing.setImage(req.getImage());
        }

        double discount = (req.getDiscount() != null) ? req.getDiscount() : 0.0;
        existing.setDiscount(discount);

        double specialPrice = (req.getSpecialPrice() != null)
                ? req.getSpecialPrice()
                : (req.getPrice() - ((discount * 0.01) * req.getPrice()));
        existing.setSpecialPrice(specialPrice);

        existing.setCategory(category);

        Product saved = productRepository.save(existing);

        // ✅ send back-in-stock emails if needed
        stockNotificationService.onProductQuantityChanged(saved, oldQty);

        return ResponseEntity.ok(toResponse(saved));
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<AdminProductResponse> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image
    ) throws IOException {

        ProductDTO updatedDto = productService.updateProductImage(id, image);

        Product updated = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        productRepository.delete(existing);
        return ResponseEntity.ok("Deleted product " + id);
    }
}

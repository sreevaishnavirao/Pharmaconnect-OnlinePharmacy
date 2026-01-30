package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.exceptions.ResourceNotFoundException;
import com.onlinepharmacy.backend.model.Product;
import com.onlinepharmacy.backend.model.ProductDetails;
import com.onlinepharmacy.backend.payload.ProductDTO;
import com.onlinepharmacy.backend.payload.ProductDetailsRequest;
import com.onlinepharmacy.backend.payload.ProductDetailsResponse;
import com.onlinepharmacy.backend.payload.ProductFullResponse;
import com.onlinepharmacy.backend.repositories.ProductDetailsRepository;
import com.onlinepharmacy.backend.repositories.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductDetailsServiceImpl implements ProductDetailsService {

    private final ProductRepository productRepo;
    private final ProductDetailsRepository detailsRepo;
    private final ModelMapper mapper;

    public ProductDetailsServiceImpl(ProductRepository productRepo,
                                     ProductDetailsRepository detailsRepo,
                                     ModelMapper mapper) {
        this.productRepo = productRepo;
        this.detailsRepo = detailsRepo;
        this.mapper = mapper;
    }

    @Override
    public ProductDetailsResponse getDetails(Long productId) {
        ProductDetails d = detailsRepo.findByProduct_ProductId(productId).orElse(null);

        if (d == null) {

            return ProductDetailsResponse.builder()
                    .productId(productId)
                    .ingredients("")
                    .usageDosage("")
                    .storageInfo("")
                    .sideEffects("")
                    .expiryDate(null)
                    .build();
        }

        return toResponse(d);
    }

    @Override
    public ProductFullResponse getProductFull(Long productId) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        ProductDTO productDTO = mapper.map(p, ProductDTO.class);
        ProductDetailsResponse details = getDetails(productId);

        return ProductFullResponse.builder()
                .product(productDTO)
                .details(details)
                .build();
    }

    @Override
    @Transactional
    public ProductDetailsResponse upsertDetails(Long productId, ProductDetailsRequest req) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        ProductDetails d = detailsRepo.findByProduct_ProductId(productId)
                .orElseGet(ProductDetails::new);


        d.setProduct(p);

        d.setIngredients(req.getIngredients());
        d.setUsageDosage(req.getUsageDosage());
        d.setStorageInfo(req.getStorageInfo());
        d.setSideEffects(req.getSideEffects());
        d.setExpiryDate(req.getExpiryDate());

        ProductDetails saved = detailsRepo.save(d);
        return toResponse(saved);
    }

    private ProductDetailsResponse toResponse(ProductDetails d) {
        Long pid = (d.getProduct() != null) ? d.getProduct().getProductId() : null;

        return ProductDetailsResponse.builder()
                .productId(pid)
                .ingredients(d.getIngredients() != null ? d.getIngredients() : "")
                .usageDosage(d.getUsageDosage() != null ? d.getUsageDosage() : "")
                .storageInfo(d.getStorageInfo() != null ? d.getStorageInfo() : "")
                .sideEffects(d.getSideEffects() != null ? d.getSideEffects() : "")
                .expiryDate(d.getExpiryDate())
                .build();
    }
}

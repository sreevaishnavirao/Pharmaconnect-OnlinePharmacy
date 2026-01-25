package com.onlinepharmacy.backend.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank
    private String productName;

    private String image;

    @NotBlank
    private String description;

    @NotNull
    private Integer quantity;

    @NotNull
    private Double price;

    private Double discount;      // optional
    private Double specialPrice;  // optional

    @NotNull
    private Long categoryId;
}

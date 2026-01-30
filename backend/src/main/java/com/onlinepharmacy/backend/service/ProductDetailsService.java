package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.payload.ProductDetailsRequest;
import com.onlinepharmacy.backend.payload.ProductDetailsResponse;
import com.onlinepharmacy.backend.payload.ProductFullResponse;

public interface ProductDetailsService {


    ProductDetailsResponse getDetails(Long productId);


    ProductFullResponse getProductFull(Long productId);


    ProductDetailsResponse upsertDetails(Long productId, ProductDetailsRequest req);
}

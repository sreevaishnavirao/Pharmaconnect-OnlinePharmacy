package com.onlinepharmacy.backend.payload;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AdminOrderPageResponse {
    private List<AdminOrderResponse> content = new ArrayList<>();
    private Integer pageNumber;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private Boolean lastPage;
}

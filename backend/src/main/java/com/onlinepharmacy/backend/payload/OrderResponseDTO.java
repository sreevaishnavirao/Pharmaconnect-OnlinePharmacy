package com.onlinepharmacy.backend.payload;

import java.util.List;

public class OrderResponseDTO {

    private List<OrderDTO> content;
    private Integer pageNumber;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private Boolean lastPage;

    public OrderResponseDTO() {}
    public OrderResponseDTO(List<OrderDTO> content,
                            Integer pageNumber,
                            Integer pageSize,
                            Long totalElements,
                            Integer totalPages,
                            Boolean lastPage) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.lastPage = lastPage;
    }

    public List<OrderDTO> getContent() {
        return content;
    }
    public void setContent(List<OrderDTO> content) {
        this.content = content;
    }
    public Integer getPageNumber() {
        return pageNumber;
    }
    public void setPageNumber(Integer pageNumber) {
        this.pageNumber = pageNumber;
    }
    public Integer getPageSize() {
        return pageSize;
    }
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    public Long getTotalElements() {
        return totalElements;
    }
    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }
    public Integer getTotalPages() {
        return totalPages;
    }
    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }
    public Boolean getLastPage() {
        return lastPage;
    }
    public void setLastPage(Boolean lastPage) {
        this.lastPage = lastPage;
    }
}

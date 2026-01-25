package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.model.Category;
import com.onlinepharmacy.backend.payload.CategoryDTO;
import com.onlinepharmacy.backend.payload.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO deleteCategory(Long categoryId);

    CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId);
}



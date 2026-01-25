package com.onlinepharmacy.backend.controller;

import com.onlinepharmacy.backend.config.AppConstants;
import com.onlinepharmacy.backend.payload.CategoryDTO;
import com.onlinepharmacy.backend.payload.CategoryResponse;
import com.onlinepharmacy.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ✅ Public: list categories (for shop)
    @GetMapping("/public/categories")
    public ResponseEntity<CategoryResponse> getAllCategories(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_CATEGORIES_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        CategoryResponse categoryResponse =
                categoryService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder);

        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    // ✅ Admin: create category (for admin panel)
    @PostMapping("/admin/categories")
    public ResponseEntity<CategoryDTO> createCategoryAdmin(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategoryDTO = categoryService.createCategory(categoryDTO);
        return new ResponseEntity<>(savedCategoryDTO, HttpStatus.CREATED);
    }

    // ✅ Admin: update category (for admin panel)
    @PutMapping("/admin/categories/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategoryAdmin(
            @Valid @RequestBody CategoryDTO categoryDTO,
            @PathVariable Long categoryId) {

        CategoryDTO savedCategoryDTO = categoryService.updateCategory(categoryDTO, categoryId);
        return new ResponseEntity<>(savedCategoryDTO, HttpStatus.OK);
    }

    // ✅ Admin: delete category (already admin)
    @DeleteMapping("/admin/categories/{categoryId}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable Long categoryId) {
        CategoryDTO deletedCategory = categoryService.deleteCategory(categoryId);
        return new ResponseEntity<>(deletedCategory, HttpStatus.OK);
    }

    // (Optional) If you still want public create/update, keep these.
    // Otherwise delete them to make categories fully admin-managed.

    // @PostMapping("/public/categories")
    // public ResponseEntity<CategoryDTO> createCategoryPublic(@Valid @RequestBody CategoryDTO categoryDTO){
    //     CategoryDTO savedCategoryDTO = categoryService.createCategory(categoryDTO);
    //     return new ResponseEntity<>(savedCategoryDTO, HttpStatus.CREATED);
    // }

    // @PutMapping("/public/categories/{categoryId}")
    // public ResponseEntity<CategoryDTO> updateCategoryPublic(@Valid @RequestBody CategoryDTO categoryDTO,
    //                                                   @PathVariable Long categoryId){
    //     CategoryDTO savedCategoryDTO = categoryService.updateCategory(categoryDTO, categoryId);
    //     return new ResponseEntity<>(savedCategoryDTO, HttpStatus.OK);
    // }
}

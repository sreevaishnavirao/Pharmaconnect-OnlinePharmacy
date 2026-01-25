package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.Category;
import com.onlinepharmacy.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ✅ Needed by ProductServiceImpl.searchByCategory(...)
    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageable);

    // ✅ Needed by AdminProductController optional filter
    List<Product> findByCategory_CategoryId(Long categoryId);

    // ✅ Needed by ProductServiceImpl.searchProductByKeyword(...)
    Page<Product> findByProductNameLikeIgnoreCase(String keyword, Pageable pageable);

    // add this method in ProductRepository
    List<Product> findByQuantityLessThanEqual(Integer quantity);

}

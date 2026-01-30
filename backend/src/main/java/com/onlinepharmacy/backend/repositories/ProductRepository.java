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

    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageable);
    List<Product> findByCategory_CategoryId(Long categoryId);
    Page<Product> findByProductNameLikeIgnoreCase(String keyword, Pageable pageable);
    List<Product> findByQuantityLessThanEqual(Integer quantity);

}

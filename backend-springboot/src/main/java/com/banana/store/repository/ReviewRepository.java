package com.banana.store.repository;

import com.banana.store.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(String productId, String status);
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
    List<Review> findByStatusOrderByCreatedAtDesc(String status);
    long countByProductId(String productId);
}


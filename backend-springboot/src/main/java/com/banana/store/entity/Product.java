package com.banana.store.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String series;

    @Column(nullable = false)
    private String capacity;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private Double price;

    @Column(name = "original_price", nullable = false)
    private Double originalPrice;

    @Column(name = "discount_percent", nullable = false)
    private Integer discountPercent;

    @Column(nullable = false, length = 1000)
    private String image;

    @Column(nullable = false)
    private Double rating;

    @Column(name = "reviews_count", nullable = false)
    private Integer reviewsCount;

    @Column
    private String badge;

    @Column(name = "is_hot", nullable = false)
    private Boolean isHot;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.rating == null) {
            this.rating = 5.0;
        }
        if (this.reviewsCount == null) {
            this.reviewsCount = 0;
        }
    }
}

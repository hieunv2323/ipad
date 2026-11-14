package com.banana.store.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "product_id", nullable = false)
    private String productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_image", length = 1000)
    private String productImage;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "username")
    private String username;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(nullable = false, length = 2000)
    private String comment;

    @Column(name = "admin_reply", length = 2000)
    private String adminReply;

    // Trạng thái: APPROVED, PENDING, HIDDEN
    @Column(nullable = false)
    @Builder.Default
    private String status = "APPROVED";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "APPROVED";
        }
        if (this.rating == null || this.rating < 1) {
            this.rating = 5;
        } else if (this.rating > 5) {
            this.rating = 5;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}


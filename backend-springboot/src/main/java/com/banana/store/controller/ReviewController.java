package com.banana.store.controller;

import com.banana.store.dto.ApiResponse;
import com.banana.store.entity.Review;
import com.banana.store.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** Khách hàng: Gửi đánh giá cho sản phẩm */
    @PostMapping
    public ResponseEntity<ApiResponse<Review>> createReview(@RequestBody Review review) {
        try {
            Review created = reviewService.createReview(review);
            return ResponseEntity.ok(ApiResponse.ok(created, "Gửi đánh giá thành công! Cảm ơn bạn đã phản hồi."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi gửi đánh giá: " + e.getMessage()));
        }
    }

    /** Admin: Xem toàn bộ đánh giá của khách hàng */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Review>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getAllReviews(), "Lấy toàn bộ đánh giá thành công!"));
    }

    /** Khách hàng: Xem các đánh giá đã duyệt của 1 sản phẩm */
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<Review>>> getProductReviews(@PathVariable("productId") String productId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getApprovedReviewsByProduct(productId), "Lấy đánh giá sản phẩm thành công!"));
    }

    /** Admin: Phản hồi đánh giá của khách */
    @PatchMapping("/{id}/reply")
    public ResponseEntity<ApiResponse<Review>> replyReview(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> body) {
        try {
            String replyText = body.get("adminReply");
            Review updated = reviewService.replyReview(id, replyText);
            return ResponseEntity.ok(ApiResponse.ok(updated, "Đã gửi phản hồi cho khách hàng!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Admin: Cập nhật trạng thái duyệt/ẩn đánh giá */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Review>> updateStatus(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            Review updated = reviewService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.ok(updated, "Cập nhật trạng thái đánh giá thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Admin: Xóa đánh giá vi phạm */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable("id") String id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok(ApiResponse.ok(null, "Đã xóa đánh giá thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}


package com.banana.store.service;

import com.banana.store.entity.Product;
import com.banana.store.entity.Review;
import com.banana.store.repository.ProductRepository;
import com.banana.store.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public Review createReview(Review review) {
        if (review.getId() == null || review.getId().isBlank()) {
            review.setId("REV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (review.getStatus() == null) {
            review.setStatus("APPROVED");
        }
        Review saved = reviewRepository.save(review);
        updateProductRatingStats(review.getProductId());
        return saved;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Review> getApprovedReviewsByProduct(String productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "APPROVED");
    }

    public Review updateStatus(String id, String status) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id));
        review.setStatus(status);
        Review saved = reviewRepository.save(review);
        updateProductRatingStats(review.getProductId());
        return saved;
    }

    public Review replyReview(String id, String replyText) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id));
        review.setAdminReply(replyText);
        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        Optional<Review> opt = reviewRepository.findById(id);
        if (opt.isPresent()) {
            String productId = opt.get().getProductId();
            reviewRepository.deleteById(id);
            updateProductRatingStats(productId);
        } else {
            throw new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id);
        }
    }

    private void updateProductRatingStats(String productId) {
        if (productId == null) return;
        Optional<Product> prodOpt = productRepository.findById(productId);
        if (prodOpt.isPresent()) {
            Product p = prodOpt.get();
            List<Review> approved = reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "APPROVED");
            if (!approved.isEmpty()) {
                double avg = approved.stream().mapToInt(Review::getRating).average().orElse(5.0);
                p.setRating(Math.round(avg * 10.0) / 10.0);
                p.setReviewsCount(approved.size());
            }
            productRepository.save(p);
        }
    }

    /** Tạo một số đánh giá mẫu thực tế nếu cơ sở dữ liệu chưa có đánh giá nào */
    public void seedSampleReviewsIfEmpty() {
        if (reviewRepository.count() > 0) return;

        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) return;

        Product p1 = products.get(0);
        Review r1 = Review.builder()
                .id("REV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .productId(p1.getId())
                .productName(p1.getName())
                .productImage(p1.getImage())
                .customerName("Trần Hoàng Nam")
                .username("namth")
                .rating(5)
                .comment("Máy mới 100% nguyên seal, màn hình OLED siêu đẹp và mượt mà. Đóng gói rất kỹ, nhân viên tư vấn nhiệt tình!")
                .adminReply("Banana Store cảm ơn anh Nam rất nhiều ạ! Chúc anh có trải nghiệm tuyệt vời cùng máy nhé! ❤️")
                .status("APPROVED")
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        reviewRepository.save(r1);

        if (products.size() > 1) {
            Product p2 = products.get(1);
            Review r2 = Review.builder()
                    .id("REV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .productId(p2.getId())
                    .productName(p2.getName())
                    .productImage(p2.getImage())
                    .customerName("Lê Thu Hà")
                    .username("thuha99")
                    .rating(5)
                    .comment("Mua cho con học online và vẽ tranh. Pin rất trâu, chip chạy mượt không hề bị nóng. Rất đáng tiền!")
                    .adminReply("Dạ cảm ơn chị Thu Hà đã tin tưởng ủng hộ Banana Store ạ!")
                    .status("APPROVED")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build();
            reviewRepository.save(r2);
        }

        if (products.size() > 2) {
            Product p3 = products.get(2);
            Review r3 = Review.builder()
                    .id("REV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .productId(p3.getId())
                    .productName(p3.getName())
                    .productImage(p3.getImage())
                    .customerName("Nguyễn Đức Huy")
                    .username("duchuy")
                    .rating(4)
                    .comment("Giao hàng nhanh trong 1 tiếng. Máy đẹp, phụ kiện đầy đủ, chỉ tiếc là chưa kịp tặng kèm ốp lưng.")
                    .adminReply("Chào anh Huy, đợt mua phụ kiện tiếp theo bên em xin gửi tặng voucher giảm 20% phụ kiện cho anh nha!")
                    .status("APPROVED")
                    .createdAt(LocalDateTime.now().minusHours(8))
                    .build();
            reviewRepository.save(r3);
        }
    }
}


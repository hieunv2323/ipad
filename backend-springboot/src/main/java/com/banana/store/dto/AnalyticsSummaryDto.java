package com.banana.store.dto;

import com.banana.store.entity.Order;
import com.banana.store.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryDto {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;
    private double averageOrderValue;

    private long pendingOrders;
    private long confirmedOrders;
    private long shippingOrders;
    private long deliveredOrders;
    private long cancelledOrders;

    private long totalReviews;
    private double averageStoreRating;
    private Map<Integer, Long> ratingBreakdown; // 5 sao, 4 sao, 3 sao, 2 sao, 1 sao

    private List<SeriesStat> revenueBySeries;
    private List<PaymentStat> revenueByPaymentMethod;
    private List<TopProductStat> topSellingProducts;

    private List<Order> recentOrders;
    private List<Review> recentReviews;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeriesStat {
        private String series;
        private long orderCount;
        private double totalRevenue;
        private double percentage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentStat {
        private String method;
        private String label;
        private long orderCount;
        private double totalRevenue;
        private double percentage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopProductStat {
        private String productId;
        private String productName;
        private String productImage;
        private long totalQuantitySold;
        private double totalRevenue;
    }
}


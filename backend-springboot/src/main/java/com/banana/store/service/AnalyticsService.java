package com.banana.store.service;

import com.banana.store.dto.AnalyticsSummaryDto;
import com.banana.store.entity.Order;
import com.banana.store.entity.Product;
import com.banana.store.entity.Review;
import com.banana.store.repository.OrderRepository;
import com.banana.store.repository.ProductRepository;
import com.banana.store.repository.RegistrationRepository;
import com.banana.store.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RegistrationRepository registrationRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    public AnalyticsSummaryDto getAnalyticsSummary() {
        long totalUsers = registrationRepository.count();
        long totalProducts = productRepository.count();

        List<Order> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        long totalOrders = allOrders.size();

        long pendingOrders = allOrders.stream().filter(o -> "PENDING".equalsIgnoreCase(o.getStatus())).count();
        long confirmedOrders = allOrders.stream().filter(o -> "CONFIRMED".equalsIgnoreCase(o.getStatus())).count();
        long shippingOrders = allOrders.stream().filter(o -> "SHIPPING".equalsIgnoreCase(o.getStatus())).count();
        long deliveredOrders = allOrders.stream().filter(o -> "DELIVERED".equalsIgnoreCase(o.getStatus())).count();
        long cancelledOrders = allOrders.stream().filter(o -> "CANCELLED".equalsIgnoreCase(o.getStatus())).count();

        List<Order> validOrders = allOrders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());

        double totalRevenue = validOrders.stream()
                .mapToDouble(o -> o.getTotalPrice() != null ? o.getTotalPrice() : 0.0)
                .sum();

        double avgOrderValue = validOrders.isEmpty() ? 0.0 : totalRevenue / validOrders.size();

        // Đánh giá
        List<Review> allReviews = reviewRepository.findAllByOrderByCreatedAtDesc();
        long totalReviews = allReviews.size();
        double avgRating = allReviews.isEmpty() ? 5.0 :
                allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);

        Map<Integer, Long> ratingBreakdown = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int star = i;
            ratingBreakdown.put(star, allReviews.stream().filter(r -> r.getRating() != null && r.getRating() == star).count());
        }

        // Doanh thu theo phương thức thanh toán
        Map<String, List<Order>> ordersByPayment = validOrders.stream()
                .collect(Collectors.groupingBy(o -> o.getPaymentMethod() != null ? o.getPaymentMethod() : "COD"));

        List<AnalyticsSummaryDto.PaymentStat> paymentStats = new ArrayList<>();
        ordersByPayment.forEach((method, orders) -> {
            double methodRev = orders.stream().mapToDouble(Order::getTotalPrice).sum();
            double pct = totalRevenue > 0 ? (methodRev / totalRevenue) * 100.0 : 0.0;
            String label = switch (method.toUpperCase()) {
                case "MOMO" -> "Ví MoMo";
                case "VNPAY" -> "Cổng VNPay";
                case "INSTALLMENT" -> "Trả góp 0%";
                default -> "Tiền mặt COD";
            };
            paymentStats.add(AnalyticsSummaryDto.PaymentStat.builder()
                    .method(method)
                    .label(label)
                    .orderCount(orders.size())
                    .totalRevenue(methodRev)
                    .percentage(Math.round(pct * 10.0) / 10.0)
                    .build());
        });

        // Doanh thu theo dòng máy iPad (Pro, Air, Mini, Gen)
        Map<String, Product> productMap = productRepository.findAll().stream()
                .collect(Collectors.toMap(Product::getId, p -> p, (p1, p2) -> p1));

        Map<String, List<Order>> ordersBySeries = new HashMap<>();
        for (Order o : validOrders) {
            String series = "iPad Gen";
            Product p = productMap.get(o.getProductId());
            if (p != null && p.getSeries() != null) {
                series = "iPad " + p.getSeries();
            } else if (o.getProductName() != null) {
                if (o.getProductName().toLowerCase().contains("pro")) series = "iPad Pro";
                else if (o.getProductName().toLowerCase().contains("air")) series = "iPad Air";
                else if (o.getProductName().toLowerCase().contains("mini")) series = "iPad Mini";
            }
            ordersBySeries.computeIfAbsent(series, k -> new ArrayList<>()).add(o);
        }

        List<AnalyticsSummaryDto.SeriesStat> seriesStats = new ArrayList<>();
        ordersBySeries.forEach((series, orders) -> {
            double sRev = orders.stream().mapToDouble(Order::getTotalPrice).sum();
            double pct = totalRevenue > 0 ? (sRev / totalRevenue) * 100.0 : 0.0;
            seriesStats.add(AnalyticsSummaryDto.SeriesStat.builder()
                    .series(series)
                    .orderCount(orders.size())
                    .totalRevenue(sRev)
                    .percentage(Math.round(pct * 10.0) / 10.0)
                    .build());
        });
        seriesStats.sort((a, b) -> Double.compare(b.getTotalRevenue(), a.getTotalRevenue()));

        // Top sản phẩm bán chạy
        Map<String, List<Order>> ordersByProduct = validOrders.stream()
                .collect(Collectors.groupingBy(Order::getProductId));

        List<AnalyticsSummaryDto.TopProductStat> topProducts = new ArrayList<>();
        ordersByProduct.forEach((prodId, orders) -> {
            long totalQty = orders.stream().mapToLong(o -> o.getQuantity() != null ? o.getQuantity() : 1).sum();
            double prodRev = orders.stream().mapToDouble(Order::getTotalPrice).sum();
            Order first = orders.get(0);
            topProducts.add(AnalyticsSummaryDto.TopProductStat.builder()
                    .productId(prodId)
                    .productName(first.getProductName())
                    .productImage(first.getProductImage())
                    .totalQuantitySold(totalQty)
                    .totalRevenue(prodRev)
                    .build());
        });
        topProducts.sort((a, b) -> Long.compare(b.getTotalQuantitySold(), a.getTotalQuantitySold()));

        return AnalyticsSummaryDto.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .averageOrderValue(Math.round(avgOrderValue))
                .pendingOrders(pendingOrders)
                .confirmedOrders(confirmedOrders)
                .shippingOrders(shippingOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .totalReviews(totalReviews)
                .averageStoreRating(Math.round(avgRating * 10.0) / 10.0)
                .ratingBreakdown(ratingBreakdown)
                .revenueBySeries(seriesStats)
                .revenueByPaymentMethod(paymentStats)
                .topSellingProducts(topProducts.stream().limit(5).collect(Collectors.toList()))
                .recentOrders(allOrders.stream().limit(5).collect(Collectors.toList()))
                .recentReviews(allReviews.stream().limit(5).collect(Collectors.toList()))
                .build();
    }
}


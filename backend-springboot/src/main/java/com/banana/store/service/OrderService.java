package com.banana.store.service;

import com.banana.store.entity.Order;
import com.banana.store.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public Order createOrder(Order order) {
        if (order.getId() == null || order.getId().isBlank()) {
            order.setId("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getOrdersByUsername(String username) {
        return orderRepository.findByUsernameOrderByCreatedAtDesc(username);
    }

    public List<Order> trackOrders(String query) {
        if (query == null || query.isBlank()) return List.of();
        String clean = query.trim();
        // 1. Tìm chính xác theo mã đơn ID
        Optional<Order> byId = orderRepository.findById(clean);
        if (byId.isPresent()) {
            return List.of(byId.get());
        }
        // 2. Tìm theo số điện thoại
        List<Order> byPhone = orderRepository.findByCustomerPhoneOrderByCreatedAtDesc(clean);
        if (!byPhone.isEmpty()) {
            return byPhone;
        }
        // 3. Tìm theo username
        return orderRepository.findByUsernameOrderByCreatedAtDesc(clean);
    }

    public Order cancelOrderByCustomer(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id));
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalArgumentException("Đơn hàng đã được xác nhận hoặc đang vận chuyển, không thể tự hủy lúc này. Vui lòng liên hệ hotline!");
        }
        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    public Order updateStatus(String id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(String id) {
        if (!orderRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id);
        }
        orderRepository.deleteById(id);
    }

    public long countByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status).size();
    }
}


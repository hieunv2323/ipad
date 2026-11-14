package com.banana.store.controller;

import com.banana.store.dto.ApiResponse;
import com.banana.store.entity.Order;
import com.banana.store.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** Khách hàng đặt hàng mới */
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody Order order) {
        try {
            Order created = orderService.createOrder(order);
            return ResponseEntity.ok(ApiResponse.ok(created, "Đặt hàng thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi đặt hàng: " + e.getMessage()));
        }
    }

    /** Admin: Lấy tất cả đơn hàng */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrders(), "Lấy danh sách đơn hàng thành công!"));
    }

    /** Khách hàng: Xem đơn hàng của mình */
    @GetMapping("/my/{username}")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@PathVariable("username") String username) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrdersByUsername(username), "Lấy đơn hàng thành công!"));
    }

    /** Khách hàng: Tra cứu đơn hàng theo mã đơn, SĐT hoặc username */
    @GetMapping("/track")
    public ResponseEntity<ApiResponse<List<Order>>> trackOrders(@RequestParam("query") String query) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.trackOrders(query), "Tra cứu đơn hàng thành công!"));
    }

    /** Khách hàng: Tự hủy đơn khi đơn còn ở trạng thái Chờ xác nhận (PENDING) */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(@PathVariable("id") String id) {
        try {
            Order cancelled = orderService.cancelOrderByCustomer(id);
            return ResponseEntity.ok(ApiResponse.ok(cancelled, "Đã hủy đơn hàng thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Admin: Cập nhật trạng thái đơn hàng */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            Order updated = orderService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.ok(updated, "Cập nhật trạng thái thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Admin: Xóa đơn hàng */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable("id") String id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(ApiResponse.ok(null, "Xóa đơn hàng thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}


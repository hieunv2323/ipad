package com.banana.store.controller;

import com.banana.store.dto.ApiResponse;
import com.banana.store.dto.MomoIpnRequest;
import com.banana.store.dto.MomoPaymentRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/payment/momo")
public class MomoPaymentController {

    private static final Logger log = LoggerFactory.getLogger(MomoPaymentController.class);

    // Lưu trữ tạm thời trạng thái giao dịch MoMo trong bộ nhớ
    private final Map<String, Map<String, Object>> momoTransactions = new ConcurrentHashMap<>();

    /**
     * 1. API Khởi tạo thanh toán MoMo (Create MoMo Payment Link & QR)
     * POST /api/payment/momo/create-payment
     */
    @PostMapping("/create-payment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPayment(@RequestBody MomoPaymentRequest request) {
        log.info("Khởi tạo thanh toán MoMo cho đơn hàng: {}, Số tiền: {} VNĐ", request.getOrderId(), request.getAmount());

        String orderId = request.getOrderId() != null ? request.getOrderId() : "BNN-" + System.currentTimeMillis();
        String requestId = UUID.randomUUID().toString();

        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("partnerCode", "MOMO_BANANA_STORE");
        paymentData.put("orderId", orderId);
        paymentData.put("requestId", requestId);
        paymentData.put("amount", request.getAmount() != null ? request.getAmount() : 0L);
        paymentData.put("orderInfo", request.getOrderInfo() != null ? request.getOrderInfo() : "Thanh toan iPad Banana Store");
        paymentData.put("qrCodeUrl", "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=281TruongDinhMoMoBananaStore_" + orderId);
        paymentData.put("payUrl", "https://test-payment.momo.vn/v2/gateway/pay?orderId=" + orderId);
        paymentData.put("resultCode", 0);
        paymentData.put("message", "Khởi tạo giao dịch MoMo thành công");
        paymentData.put("status", "PENDING");

        momoTransactions.put(orderId, paymentData);

        return ResponseEntity.ok(ApiResponse.ok(paymentData, "Tạo liên kết thanh toán MoMo thành công"));
    }

    /**
     * 2. API Webhook IPN (Instant Payment Notification) từ MoMo Server gửi về
     * POST /api/payment/momo/ipn
     * 
     * MoMo Server sẽ gọi URL này tự động khi người dùng quét QR & hoàn tất chuyển tiền.
     */
    @PostMapping("/ipn")
    public ResponseEntity<Map<String, Object>> handleMomoIpn(@RequestBody MomoIpnRequest ipnRequest) {
        log.info(">>> NHẬN WEBHOOK/IPN TỪ MOMO SERVER: orderId={}, amount={}, resultCode={}, transId={}",
                ipnRequest.getOrderId(), ipnRequest.getAmount(), ipnRequest.getResultCode(), ipnRequest.getTransId());

        Map<String, Object> response = new HashMap<>();

        if (ipnRequest.getResultCode() != null && ipnRequest.getResultCode() == 0) {
            log.info("✅ Giao dịch MoMo [{}] THANH TOÁN THÀNH CÔNG! Số tiền: {} VNĐ", ipnRequest.getOrderId(), ipnRequest.getAmount());

            Map<String, Object> tx = momoTransactions.getOrDefault(ipnRequest.getOrderId(), new HashMap<>());
            tx.put("status", "PAID");
            tx.put("transId", ipnRequest.getTransId());
            tx.put("resultCode", 0);
            tx.put("paidAt", System.currentTimeMillis());
            momoTransactions.put(ipnRequest.getOrderId(), tx);

            response.put("resultCode", 0);
            response.put("message", "Cập nhật trạng thái đơn hàng MoMo thành công");
        } else {
            log.warn("❌ Giao dịch MoMo [{}] THẤT BẠI hoặc BỊ HỦY. Lỗi: {}", ipnRequest.getOrderId(), ipnRequest.getMessage());

            response.put("resultCode", ipnRequest.getResultCode() != null ? ipnRequest.getResultCode() : 99);
            response.put("message", "Giao dịch không thành công");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * 3. API Kiểm tra trạng thái đơn hàng MoMo (Query Payment Status)
     * GET /api/payment/momo/query-status/{orderId}
     */
    @GetMapping("/query-status/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> queryStatus(@PathVariable String orderId) {
        Map<String, Object> tx = momoTransactions.get(orderId);
        if (tx == null) {
            Map<String, Object> notFound = new HashMap<>();
            notFound.put("orderId", orderId);
            notFound.put("status", "NOT_FOUND");
            return ResponseEntity.ok(ApiResponse.ok(notFound, "Không tìm thấy giao dịch MoMo"));
        }
        return ResponseEntity.ok(ApiResponse.ok(tx, "Trạng thái giao dịch MoMo"));
    }
}

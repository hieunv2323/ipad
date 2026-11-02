package com.banana.store.service;

import com.banana.store.dto.ChatRequest;
import com.banana.store.dto.ChatResponse;
import com.banana.store.entity.Product;
import com.banana.store.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeminiChatService {

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key:YOUR_GEMINI_API_KEY}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    public ChatResponse processChat(ChatRequest request) {
        String userMsg = request.getMessage() != null ? request.getMessage().trim() : "";
        if (userMsg.isEmpty()) {
            return ChatResponse.builder()
                    .reply("Xin chào! Tôi có thể giúp gì cho bạn trong việc lựa chọn iPad phù hợp hôm nay?")
                    .recommendedProducts(Collections.emptyList())
                    .isAiGenerated(false)
                    .build();
        }

        List<Product> allProducts = productRepository.findAllByOrderByCreatedAtDesc();

        // Try calling Gemini API if API key is validly configured
        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.contains("YOUR_GEMINI_API_KEY")) {
            try {
                String aiReply = callGeminiApi(userMsg, request.getHistory(), allProducts);
                if (aiReply != null && !aiReply.trim().isEmpty()) {
                    List<Product> matchedProducts = findRelevantProducts(userMsg + " " + aiReply, allProducts);
                    return ChatResponse.builder()
                            .reply(aiReply)
                            .recommendedProducts(matchedProducts)
                            .isAiGenerated(true)
                            .build();
                }
            } catch (Exception e) {
                System.err.println("Gemini API call failed, falling back to smart recommender: " + e.getMessage());
            }
        }

        // Smart fallback recommendation when API key is not configured or fails
        return generateSmartFallbackResponse(userMsg, allProducts);
    }

    private String callGeminiApi(String userMsg, List<ChatRequest.ChatMessageDto> history, List<Product> products) throws Exception {
        String fullUrl = apiUrl + "?key=" + apiKey;

        StringBuilder productCatalogText = new StringBuilder();
        productCatalogText.append("DANH SÁCH SẢN PHẨM HIỆN CÓ TẠI CỬA HÀNG BANANA STORE:\n");
        for (Product p : products) {
            productCatalogText.append(String.format("- %s | Dòng: %s | Dung lượng: %s | Màu: %s | Giá bán: %,.0f VNĐ (Giá gốc: %,.0f VNĐ) | Mã ID: %s\n",
                    p.getName(), p.getSeries(), p.getCapacity(), p.getColor(), p.getPrice(), p.getOriginalPrice() != null ? p.getOriginalPrice() : p.getPrice(), p.getId()));
        }

        String systemPrompt = "Bạn là Trợ Lý AI Chuyên Nghiệp của Banana Store - Cửa hàng bán lẻ iPad chính hãng giá tốt hàng đầu.\n"
                + "Nhiệm vụ của bạn là tư vấn cho khách hàng chọn mua máy iPad phù hợp với nhu cầu (học tập, đồ họa, chơi game, giải trí, làm việc) và ngân sách của họ.\n"
                + "YÊU CẦU TƯ VẤN:\n"
                + "1. Trả lời thân thiện, lịch sự, tư vấn chính xác dựa trên danh sách sản phẩm thực tế của Banana Store dưới đây.\n"
                + "2. Sử dụng định dạng đẹp mắt, ngắn gọn, có icon emoji phù hợp.\n"
                + "3. Nêu rõ ưu điểm của từng mẫu iPad phù hợp với nhu cầu khách hàng.\n"
                + "4. Nếu khách hỏi sản phẩm cụ thể, hãy xác nhận thông tin giá và tính năng.\n\n"
                + productCatalogText.toString();

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contentsList = new ArrayList<>();

        // Add history or prompt
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");

        List<Map<String, String>> parts = new ArrayList<>();
        Map<String, String> partText = new HashMap<>();
        partText.put("text", systemPrompt + "\n\nCÂU HỎI CỦA KHÁCH HÀNG: " + userMsg);
        parts.add(partText);

        userContent.put("parts", parts);
        contentsList.add(userContent);

        requestBody.put("contents", contentsList);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode partsNode = candidates.get(0).path("content").path("parts");
                if (partsNode.isArray() && partsNode.size() > 0) {
                    return partsNode.get(0).path("text").asText();
                }
            }
        }
        return null;
    }

    private ChatResponse generateSmartFallbackResponse(String userMsg, List<Product> allProducts) {
        String lower = userMsg.toLowerCase();
        List<Product> recommended = new ArrayList<>();
        StringBuilder reply = new StringBuilder();

        reply.append("🤖 **Trợ lý AI Banana Store** xin chào bạn! ");

        if (lower.contains("vẽ") || lower.contains("đồ họa") || lower.contains("thiết kế") || lower.contains("pencil")) {
            reply.append("Đối với nhu cầu **vẽ đồ họa, thiết kế sáng tạo**, các dòng **iPad Pro** hoặc **iPad Air** với màn hình Promotion 120Hz và chip M-series mạnh mẽ là lựa chọn xuất sắc nhất!\n\n");
            recommended = allProducts.stream()
                    .filter(p -> p.getSeries().equalsIgnoreCase("Pro") || p.getSeries().equalsIgnoreCase("Air"))
                    .limit(3)
                    .collect(Collectors.toList());
        } else if (lower.contains("học") || lower.contains("sinh viên") || lower.contains("học sinh") || lower.contains("xem phim")) {
            reply.append("Đối với nhu cầu **học tập, ghi chép, xem phim, lướt web hàng ngày**, các dòng **iPad Gen 10 / Gen 9** hoặc **iPad Air** có mức giá cực tốt và pin lâu rất phù hợp cho bạn!\n\n");
            recommended = allProducts.stream()
                    .filter(p -> p.getSeries().equalsIgnoreCase("Gen") || p.getSeries().equalsIgnoreCase("Air") || p.getPrice() < 20000000)
                    .limit(3)
                    .collect(Collectors.toList());
        } else if (lower.contains("game") || lower.contains("chơi game") || lower.contains("mượt") || lower.contains("cấu hình cao")) {
            reply.append("Để **chơi game mượt mà**, không giật lag, bạn nên chọn các dòng máy chip **Apple M1, M2, M4** hoặc dòng **iPad Mini** gọn nhẹ dễ cầm nắm!\n\n");
            recommended = allProducts.stream()
                    .filter(p -> p.getSeries().equalsIgnoreCase("Pro") || p.getSeries().equalsIgnoreCase("Mini"))
                    .limit(3)
                    .collect(Collectors.toList());
        } else if (lower.contains("rẻ") || lower.contains("dưới 10") || lower.contains("dưới 15") || lower.contains("tiết kiệm")) {
            reply.append("Dưới đây là danh sách các dòng **iPad có mức giá hấp dẫn nhất** tại Banana Store hiện tại:\n\n");
            recommended = allProducts.stream()
                    .sorted(Comparator.comparingDouble(Product::getPrice))
                    .limit(3)
                    .collect(Collectors.toList());
        } else {
            reply.append("Dựa trên yêu cầu của bạn, Banana Store xin gợi ý những mẫu iPad HOT nhất đang có sẵn hàng với ưu đãi lớn:\n\n");
            recommended = allProducts.stream()
                    .filter(p -> Boolean.TRUE.equals(p.getIsHot()) || p.getBadge() != null)
                    .limit(3)
                    .collect(Collectors.toList());
            if (recommended.isEmpty() && !allProducts.isEmpty()) {
                recommended = allProducts.stream().limit(3).collect(Collectors.toList());
            }
        }

        for (Product p : recommended) {
            reply.append(String.format("👉 **%s** (%s - %s)\n   • Giá ưu đãi: **%,.0f VNĐ** (Tiết kiệm %d%%)\n",
                    p.getName(), p.getCapacity(), p.getColor(), p.getPrice(), p.getDiscountPercent()));
        }

        reply.append("\n💡 *Mẹo: Bạn có thể nhập khoảnh giá hoặc nhu cầu cụ thể (ví dụ: 'Cần iPad giá dưới 15 triệu để học tiếng Anh') để mình tư vấn chi tiết hơn nhé!*");

        return ChatResponse.builder()
                .reply(reply.toString())
                .recommendedProducts(recommended)
                .isAiGenerated(false)
                .build();
    }

    private List<Product> findRelevantProducts(String text, List<Product> products) {
        String lowerText = text.toLowerCase();
        return products.stream()
                .filter(p -> lowerText.contains(p.getName().toLowerCase()) ||
                             lowerText.contains(p.getSeries().toLowerCase()) ||
                             (lowerText.contains("pro") && p.getSeries().equalsIgnoreCase("Pro")) ||
                             (lowerText.contains("air") && p.getSeries().equalsIgnoreCase("Air")) ||
                             (lowerText.contains("mini") && p.getSeries().equalsIgnoreCase("Mini")))
                .distinct()
                .limit(3)
                .collect(Collectors.toList());
    }
}

package com.banana.store.controller;

import com.banana.store.dto.ApiResponse;
import com.banana.store.dto.ChatRequest;
import com.banana.store.dto.ChatResponse;
import com.banana.store.service.GeminiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class GeminiChatController {

    private final GeminiChatService geminiChatService;

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> consult(@RequestBody ChatRequest request) {
        try {
            ChatResponse response = geminiChatService.processChat(request);
            return ResponseEntity.ok(ApiResponse.ok(response, "Thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi khi xử lý tư vấn: " + e.getMessage()));
        }
    }
}

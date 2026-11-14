package com.banana.store.controller;

import com.banana.store.dto.AnalyticsSummaryDto;
import com.banana.store.dto.ApiResponse;
import com.banana.store.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /** Admin: Lấy báo cáo thống kê & phân tích kinh doanh */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDto>> getSummary() {
        AnalyticsSummaryDto summary = analyticsService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.ok(summary, "Lấy dữ liệu báo cáo thống kê thành công!"));
    }
}


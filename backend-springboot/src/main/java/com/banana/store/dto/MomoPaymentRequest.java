package com.banana.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomoPaymentRequest {
    private String orderId;
    private Long amount;
    private String orderInfo;
    private String customerPhone;
}

package com.ssafy.tingbackend.point.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

public class PaymentDto {

    private PaymentDto() {
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadyRequest {
        private Long pointCode;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadyResponse {
        private Long pointPaymentId;
        private String redirectUrl;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class KakaoApiReadyResponse {
        private String tid;
        private String next_redirect_pc_url;
        private String created_at;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproveRequest {
        private String pgToken;
    }

}

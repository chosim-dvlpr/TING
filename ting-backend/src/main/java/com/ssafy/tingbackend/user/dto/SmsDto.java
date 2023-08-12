package com.ssafy.tingbackend.user.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class SmsDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        String type;  // SMS 타입
        String from;  // 발신번호
        String content;  // 기본 메시지 내용
        List<MessageDto> messages;  // 메시지 정보
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        String requestId;  // 요청 아이디
        LocalDateTime requestTime;  // 요청 시간
        String statusCode;  // 요청 상태 코드 (202: 성공, 그 외: 실패)
        String statusName;  // 요청 상태명 (success: 성공, fail: 실패)
    }
}

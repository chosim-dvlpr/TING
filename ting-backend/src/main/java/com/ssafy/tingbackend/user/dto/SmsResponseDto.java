package com.ssafy.tingbackend.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class SmsResponseDto {
    String requestId;  // 요청 아이디
    LocalDateTime requestTime;  // 요청 시간
    String statusCode;  // 요청 상태 코드 (202: 성공, 그 외: 실패)
    String statusName;  // 요청 상태명 (success: 성공, fail: 실패)
}

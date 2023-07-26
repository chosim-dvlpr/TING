package com.ssafy.tingbackend.user.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmsRequestDto {
    String type;  // SMS 타입
    String from;  // 발신번호
    String content;  // 기본 메시지 내용
    List<MessageDto> messages;  // 메시지 정보
}

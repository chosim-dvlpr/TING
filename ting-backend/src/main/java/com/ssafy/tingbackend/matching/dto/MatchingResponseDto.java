package com.ssafy.tingbackend.matching.dto;

import lombok.*;

@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchingResponseDto {
    private boolean matchingResult;  // 매칭이 성사된 경우 true, 아니면 false
    private String token;
    private Long matchingId;
}

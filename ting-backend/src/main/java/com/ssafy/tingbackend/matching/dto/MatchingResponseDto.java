package com.ssafy.tingbackend.matching.dto;

import lombok.*;

@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchingResponseDto {
    private String token;
    private Long matchingId;
}

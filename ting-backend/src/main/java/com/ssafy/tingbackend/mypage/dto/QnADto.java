package com.ssafy.tingbackend.mypage.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QnADto {
    private Long qnaId;
    private Long userId;
    private String title;
    private String content;
    private String answer;
    private LocalDateTime createdTime;
    private LocalDateTime completedTime;
}

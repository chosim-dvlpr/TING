package com.ssafy.tingbackend.admin.dto;

import com.ssafy.tingbackend.entity.QnA;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminQnaDto {
    private Long qnaId;
    private Long userId;

    private String title;
    private String content;
    private String answer;

    private LocalDateTime completedTime;
    private boolean isCompleted;

    public static AdminQnaDto of(QnA qna) {
        return AdminQnaDto.builder()
                .qnaId(qna.getId())
                .userId(qna.getUser().getId())
                .title(qna.getTitle())
                .content(qna.getContent())
                .answer(qna.getAnswer())
                .completedTime(qna.getCompletedTime())
                .isCompleted(qna.isCompleted())
                .build();
    }
}

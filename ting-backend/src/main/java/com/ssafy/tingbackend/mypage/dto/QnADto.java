package com.ssafy.tingbackend.mypage.dto;

import com.ssafy.tingbackend.entity.QnA;
import lombok.*;
import java.time.LocalDateTime;

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

    public static QnADto of(QnA qna, Long userId) {
        return QnADto.builder()
                .userId(userId)
                .qnaId(qna.getId())
                .title(qna.getTitle())
                .content(qna.getContent())
                .answer(qna.getAnswer())
                .createdTime(qna.getCreatedTime())
                .completedTime(qna.getCompletedTime())
                .build();
    }
}

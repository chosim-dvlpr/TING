package com.ssafy.tingbackend.date.dto;

import com.ssafy.tingbackend.entity.matching.Question;
import com.ssafy.tingbackend.entity.type.QuestionType;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private Long id;
    private String questionCard;
    private QuestionType category;

    public QuestionDto(String questionCard, QuestionType category) {
        this.questionCard = questionCard;
        this.category = category;
    }

    public static QuestionDto of(Question question) {
        return QuestionDto.builder()
                .id(question.getId())
                .questionCard(question.getQuestionCard())
                .category(question.getCategory())
                .build();
    }
}

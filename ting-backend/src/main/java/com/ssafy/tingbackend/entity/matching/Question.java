package com.ssafy.tingbackend.entity.matching;

import com.ssafy.tingbackend.entity.type.QuestionType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"questionCard", "category"})
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionCard;
    @Enumerated(EnumType.STRING)
    private QuestionType category; // 1필수 2랜덤
}

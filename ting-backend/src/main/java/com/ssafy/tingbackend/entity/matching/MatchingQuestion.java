package com.ssafy.tingbackend.entity.matching;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"matching", "question", "questionOrder"})
public class MatchingQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_id")
    private Matching matching;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    private Integer questionOrder;

    public MatchingQuestion(Matching matching, Question question, Integer questionOrder) {
        this.matching = matching;
        this.question = question;
        this.questionOrder = questionOrder;
    }

}

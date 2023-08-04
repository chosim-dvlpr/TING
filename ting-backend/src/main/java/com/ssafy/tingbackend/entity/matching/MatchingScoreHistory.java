package com.ssafy.tingbackend.entity.matching;

import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"questionOrder","question", "score"})
@Builder
@AllArgsConstructor
public class MatchingScoreHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_id")
    private Matching matching;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_code")
    private Question question;
    private Integer questionOrder;
    private Integer score;

    /*
    // 변경?
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_question_id")
    private MatchingQuestion matchingQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Integer score;
     */
}

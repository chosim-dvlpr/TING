package com.ssafy.tingbackend.date.dto;

import com.ssafy.tingbackend.board.dto.IssueBoardDto;
import com.ssafy.tingbackend.entity.board.AdviceBoard;
import com.ssafy.tingbackend.entity.board.Comment;
import com.ssafy.tingbackend.entity.board.IssueBoard;
import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.matching.MatchingScoreHistory;
import com.ssafy.tingbackend.entity.matching.Question;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreHistoryDto {
    private Long matchingId;
    private Long userId;
    private Long questionId;
    private Integer questionOrder;
    private Integer score;

    public static ScoreHistoryDto of(MatchingScoreHistory matchingScoreHistory, Matching matching, User user, Question question) {
        return ScoreHistoryDto.builder()
                .matchingId(matching.getId())
                .userId(user.getId())
                .questionId(question.getId())
                .questionOrder(matchingScoreHistory.getQuestionOrder())
                .score(matchingScoreHistory.getScore())
                .build();
    }
}

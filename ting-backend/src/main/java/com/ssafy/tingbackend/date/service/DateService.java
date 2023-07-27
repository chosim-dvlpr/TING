package com.ssafy.tingbackend.date.service;


import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.date.dto.QuestionDto;
import com.ssafy.tingbackend.date.dto.ScoreHistoryDto;
import com.ssafy.tingbackend.date.repository.MatchingScoreHistoryRepository;
import com.ssafy.tingbackend.date.repository.QuestionRepository;
import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.matching.MatchingScoreHistory;
import com.ssafy.tingbackend.entity.matching.MatchingUser;
import com.ssafy.tingbackend.entity.matching.Question;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.matching.repository.MatchingRepository;
import com.ssafy.tingbackend.matching.repository.MatchingUserRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class DateService {
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final MatchingRepository matchingRepository;
    private final MatchingScoreHistoryRepository matchingScoreHistoryRepository;
    private final MatchingUserRepository matchingUserRepository;

    public List<QuestionDto> getQuestions() {
        List<Question> questionList = questionRepository.findAll();
        List<QuestionDto> questions = new ArrayList<>();
        for(Question question: questionList) {
            questions.add(QuestionDto.of(question));
        }
        return questions;
    }

    public void insertScoreHistory(ScoreHistoryDto scoreHistoryDto) {
        User user = userRepository.findById(scoreHistoryDto.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        Question question = questionRepository.findById(scoreHistoryDto.getQuestionId())
                .orElseThrow(() -> new CommonException(ExceptionType.QUESTION_NOT_FOUND));

        Matching matching = matchingRepository.findById(scoreHistoryDto.getMatchingId())
                .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));

        //상대 userId 가져오기
        User userfriend = matchingUserRepository.findFriend(matching, user)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));


        MatchingScoreHistory matchingScoreHistory = MatchingScoreHistory.builder()
                .matching(matching)
                .user(userfriend)
                .question(question)
                .questionOrder(scoreHistoryDto.getQuestionOrder())
                .score(scoreHistoryDto.getScore())
                .build();

        matchingScoreHistoryRepository.save(matchingScoreHistory);
    }

    @Transactional
    public void insertTotalScore(Map<String, Long> map) {
        User user = userRepository.findById(map.get("userId"))
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        Matching matching = matchingRepository.findById(map.get("matchingId"))
                .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
        MatchingUser matchingUser = matchingUserRepository.findFriendInfo(matching, user)
                .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));

        matchingUser.setTotalScore(map.get("totalScore").intValue());
    }
}

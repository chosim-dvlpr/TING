package com.ssafy.tingbackend.date.service;


import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.date.dto.QuestionDto;
import com.ssafy.tingbackend.date.dto.ScoreHistoryDto;
import com.ssafy.tingbackend.date.repository.MatchingScoreHistoryRepository;
import com.ssafy.tingbackend.date.repository.QuestionRepository;
import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.chatting.ChattingUser;
import com.ssafy.tingbackend.entity.matching.*;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.entity.type.QuestionType;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.friend.repository.ChattingRepository;
import com.ssafy.tingbackend.friend.repository.ChattingUserRepository;
import com.ssafy.tingbackend.matching.repository.MatchingQuestionRepository;
import com.ssafy.tingbackend.matching.repository.MatchingRepository;
import com.ssafy.tingbackend.matching.repository.MatchingUserRepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
@Service
@RequiredArgsConstructor
public class DateService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final MatchingRepository matchingRepository;
    private final MatchingScoreHistoryRepository matchingScoreHistoryRepository;
    private final MatchingUserRepository matchingUserRepository;
    private final ChattingRepository chattingRepository;
    private final ChattingUserRepository chattingUserRepository;
    private final MatchingQuestionRepository matchingQuestionRepository;

    public List<QuestionDto> getMatchingQuestions(Long matchingId) {
        Matching matching = matchingRepository.findById(matchingId)
                .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
        List<MatchingQuestion> matchingQuestions = matchingQuestionRepository.findByMatchingOrderByQuestionOrder(matching);

        // 인사 -> 질문카드 10개 -> 끝 -> 최종 점수 -> 마지막 어필
        List<QuestionDto> questions = new ArrayList<>();
        questions.add(new QuestionDto("인사"));
        for (int i = 0; i < 10; i++) {
            questions.add(QuestionDto.of(matchingQuestions.get(i).getQuestion()));
        }
        questions.add(new QuestionDto("끝"));
        questions.add(new QuestionDto("최종 점수"));
        questions.add(new QuestionDto("마지막 어필"));

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

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void selectFinalChoice(Long matchingId, String selected, Long userId) {
        // DB에서 정보 불러오기
        Matching matching = matchingRepository.findById(matchingId)
                .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));
        MatchingUser matchingUser = matchingUserRepository.findByMatchingAndUser(matching, user)
                .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));

        matchingUser.setFinalChoice(selected.equals("yes") ? true : false);  // 응답한 선택 저장

        // 상대방이 응답했는지 확인
        MatchingUser matchingPairUser = matchingUserRepository.findFriendInfo(matching, user)
                .orElseThrow(() -> new CommonException(ExceptionType.MATCHING_NOT_FOUND));
        if (matchingPairUser.getFinalChoice() != null) {  // 상대방이 응답한 경우
            boolean isSuccess = false;
            // 둘 다 yes 선택 - 성공O
            if (matchingPairUser.getFinalChoice() && matchingUser.getFinalChoice()) isSuccess = true;

            // DB에 최종 선택 결과값 저장
            matching.setIsSuccess(isSuccess);

            if (isSuccess) {
                // 채팅방 생성
                Chatting chatting = new Chatting(ChattingType.ALIVE);
                chattingRepository.save(chatting);
                chattingUserRepository.save(new ChattingUser(chatting, user));
                chattingUserRepository.save(new ChattingUser(chatting, matchingPairUser.getUser()));
                chatting.setLastChattingContent("♡대화를 시작해보세요♡");
                chatting.setLastChattingTime(LocalDateTime.now());
            }
        }
    }

}

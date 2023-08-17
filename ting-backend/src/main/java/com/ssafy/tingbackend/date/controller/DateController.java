package com.ssafy.tingbackend.date.controller;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.date.dto.QuestionDto;
import com.ssafy.tingbackend.date.dto.ScoreHistoryDto;
import com.ssafy.tingbackend.date.service.DateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DateController {

    private final DateService dateService;

    /**
     * 질문카드 조회 API
     *
     * @return 질문카드 리스트
     */
    @GetMapping("/date/question/{matchingId}")
    public DataResponse<List<QuestionDto>> listQuestion(@PathVariable Long matchingId) {
        List<QuestionDto> questionList = dateService.getMatchingQuestions(matchingId);
        return new DataResponse<>(200, "질문카드 조회 성공", questionList);
    }

    /**
     * 질문별 점수 저장 API
     *
     * @param principal       로그인한 유저의 id (자동주입)
     * @param scoreHistoryDto matchingId, questionId, score, questionOrder
     * @return Only code and message
     */
    @PostMapping("/date/score")
    public CommonResponse insertScoreHistory(@RequestBody ScoreHistoryDto scoreHistoryDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        scoreHistoryDto.setUserId(userId);
        dateService.insertScoreHistory(scoreHistoryDto);
        return new CommonResponse(200, "질문별 점수 저장 성공");
    }

    /**
     * 최종 점수 저장 API
     *
     * @param principal 로그인한 유저의 id (자동주입)
     * @param map       matchingId, totalScore
     * @return Only code and message
     */
    @PostMapping("/date/score/total")
    public CommonResponse insertScore(@RequestBody Map<String, Long> map, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        map.put("userId", userId);
        dateService.insertTotalScore(map);
        return new CommonResponse(200, "최종 점수 저장 성공");
    }

    /**
     * 최종 선택 API
     *
     * @param principal  로그인한 유저의 id (자동주입)
     * @param requestMap matchingId, choice
     * @return 매칭 성공 여부
     */
    @PostMapping("/date/result")
    public CommonResponse selectFinalChoice(@RequestBody Map<String, Object> requestMap, Principal principal) throws InterruptedException {
        log.info("===========selectFinalChoice===========");
        log.info("requestMap: {}", requestMap);
        log.info("userId: {}", principal.getName());

        Long matchingId = Long.parseLong(requestMap.get("matchingId").toString());
        Long userId = Long.parseLong(principal.getName());
        log.info("/date/result - matchingId: {}", matchingId);
        log.info("/date/result - userId: {}", userId);

        dateService.selectFinalChoice(matchingId, requestMap.get("choice").toString(), userId);

        return new CommonResponse(200, "최종 선택 완료");
    }

}

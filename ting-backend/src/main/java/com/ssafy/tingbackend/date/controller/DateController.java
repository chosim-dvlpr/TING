package com.ssafy.tingbackend.date.controller;

import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.date.dto.QuestionDto;
import com.ssafy.tingbackend.date.service.DateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DateController {

    private final DateService dateService;

    /**
     * 질문카드 조회 API
     * @return 질문카드 리스트
     */
    @GetMapping("/date/question")
    public DataResponse<List<QuestionDto>> listQuestion() {
        List<QuestionDto> questionList = dateService.getQuestions();
        return new DataResponse<>(200, "질문카드 조회 성공", questionList);
    }

}

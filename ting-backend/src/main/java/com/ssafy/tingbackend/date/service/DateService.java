package com.ssafy.tingbackend.date.service;


import com.ssafy.tingbackend.date.dto.QuestionDto;
import com.ssafy.tingbackend.date.repository.QuestionRepository;
import com.ssafy.tingbackend.entity.matching.Question;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class DateService {
    private final QuestionRepository questionRepository;
    public List<QuestionDto> getQuestions() {
        List<Question> questionList = questionRepository.findAll();
        List<QuestionDto> questions = new ArrayList<>();
        for(Question question: questionList) {
            questions.add(QuestionDto.of(question));
        }
        return questions;
    }
}

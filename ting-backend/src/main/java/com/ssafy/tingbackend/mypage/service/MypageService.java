package com.ssafy.tingbackend.mypage.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.QnA;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.mypage.dto.QnADto;
import com.ssafy.tingbackend.mypage.repository.QnARepository;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MypageService {
    private final QnARepository qnaRepository;
    private final UserRepository userRepository;

    public void insertQnA(QnADto qnaDto) {
        User user = userRepository.findById(qnaDto.getUserId())
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        QnA qna = QnA.builder()
                .user(user)
                .title(qnaDto.getTitle())
                .content(qnaDto.getContent())
                .build();

        qnaRepository.save(qna);
    }

    public void deleteQnA(Long qnaId, Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        QnA qna = QnA.builder()
                .id(qnaId)
                .build();
        qnaRepository.delete(qna);
    }
}

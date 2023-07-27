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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    public QnADto qnaDetail(Long qnaId, Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        QnA qna = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new CommonException(ExceptionType.QNA_NOT_FOUND));
        return QnADto.builder()
                .qnaId(qnaId)
                .userId(userId)
                .title(qna.getTitle())
                .content(qna.getContent())
                .answer(qna.getAnswer())
                .createdTime(qna.getCreatedTime())
                .completedTime(qna.getCompletedTime())
                .build();
    }

    public List<QnADto> qnaList(int pageNo, Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        // 페이징
        PageRequest pageRequest = PageRequest.of(pageNo-1, 2, Sort.by(Sort.Direction.DESC,
                "createdTime"));
        Page<QnA> page = qnaRepository.findByUserId(userId, pageRequest);
        List<QnA> qnaList = page.getContent();
        List<QnADto> qnADtoList = new ArrayList<>();
        for(QnA qna : qnaList) {
            qnADtoList.add(QnADto.of(qna, userId));
        }
        return qnADtoList;
    }
}

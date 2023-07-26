package com.ssafy.tingbackend.mypage.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.entity.QnA;
import com.ssafy.tingbackend.mypage.dto.QnADto;
import com.ssafy.tingbackend.mypage.service.MypageService;
import com.ssafy.tingbackend.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MypageController {

    private final MypageService mypageService;

    /**
     * 문의 작성 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param qnaDto title, content
     * @return Only code and message
     */
    @PostMapping("/mypage/qna")
    public CommonResponse writeQuestion(@RequestBody QnADto qnaDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        qnaDto.setUserId(userId);
        mypageService.insertQnA(qnaDto);
        return new CommonResponse(200, "문의글 작성 성공");
    }

    @DeleteMapping("/mypage/qna/{qnaId}")
    public CommonResponse deleteQuestion(@PathVariable Long qnaId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        mypageService.deleteQnA(qnaId, userId);
        return new CommonResponse(200, "문의글 삭제 성공");
    }

}

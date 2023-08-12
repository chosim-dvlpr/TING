package com.ssafy.tingbackend.mypage.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.mypage.dto.QnADto;
import com.ssafy.tingbackend.mypage.service.MypageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

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

    /**
     * 문의 삭제 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param qnaId
     * @return Only code and message
     */
    @DeleteMapping("/mypage/qna/{qnaId}")
    public CommonResponse deleteQuestion(@PathVariable Long qnaId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        mypageService.deleteQnA(qnaId, userId);
        return new CommonResponse(200, "문의글 삭제 성공");
    }

    /**
     * 문의 상세 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param qnaId
     * @return 문의 상세 정보
     */
    @GetMapping("/mypage/qna/{qnaId}")
    public DataResponse<QnADto> detailQuestion(@PathVariable Long qnaId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        QnADto qnaDto = mypageService.qnaDetail(qnaId, userId);
        return new DataResponse<>(200, "문의글 상세 조회 성공", qnaDto);
    }

    /**
     * 문의 목록 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param pageNo
     * @return 문의 목록 리스트
     */
    @GetMapping("/mypage/qna")
    public DataResponse<Map<String, Object>> listQuestion(@RequestParam("pageNo") int pageNo, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        Map<String, Object> result = mypageService.qnaList(pageNo, userId);
        return new DataResponse<>(200, "문의글 목록 조회 성공", result);
    }

}

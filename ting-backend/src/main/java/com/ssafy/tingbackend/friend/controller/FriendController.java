package com.ssafy.tingbackend.friend.controller;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.friend.dto.ChattingDto;
import com.ssafy.tingbackend.friend.service.FriendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class FriendController {
    private final FriendService friendService;

    /**
     * 친구 목록 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 친구 목록 정보
     */
    @GetMapping("/friend")
    public DataResponse<List<ChattingDto>> chattingList(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        List<ChattingDto> chattingList = friendService.chattingList(userId);
        return new DataResponse<>(200, "친구 목록 조회 성공", chattingList);
    }
}

package com.ssafy.tingbackend.friend.controller;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.friend.dto.ChattingDto;
import com.ssafy.tingbackend.friend.service.FriendService;
import com.ssafy.tingbackend.friend.service.TemperatureService;
import com.ssafy.tingbackend.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class FriendController {

    private final FriendService friendService;
    private final TemperatureService temperatureService;

    /**
     * 친구 목록 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 친구 목록 정보
     */
    @GetMapping("/friend")
    public DataResponse<List<ChattingDto>> friendList(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        List<ChattingDto> chattingList = friendService.friendList(userId);
        return new DataResponse<>(200, "친구 목록 조회 성공", chattingList);
    }

    /**
     * 친구 프로필 조회 API
     * @param userId
     * @return 친구 프로필 정보
     */
    @GetMapping("/friend/profile/{userId}")
    public DataResponse<UserDto.Info> friendInfo(@PathVariable Long userId) {
        UserDto.Info userDto = friendService.friendInfo(userId);
        return new DataResponse<>(200, "친구 프로필 조회 성공", userDto);
    }

    /**
     * 친구 부활 API
     * @param chattingId
     * @return Only code and message
     */
    @PutMapping("/friend/{chattingId}")
    public CommonResponse aliveFriend(@PathVariable Long chattingId) {
        friendService.aliveFriend(chattingId);
        return new CommonResponse(200, "친구 부활 성공");
    }

    /**
     * 친구 삭제 API
     * @param chattingId
     * @return Only code and message
     */
    @DeleteMapping("/friend/{chattingId}")
    public CommonResponse deleteFriend(@PathVariable Long chattingId) {
        friendService.deleteFriend(chattingId);
        return new CommonResponse(200, "친구 삭제 성공");
    }
    
}

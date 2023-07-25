package com.ssafy.tingbackend.user.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.dto.UserResponseDto;
import com.ssafy.tingbackend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/user/login")
    public DataResponse<Map<String, String>> login(@RequestBody UserDto userDto) {
        Map<String, String> token = userService.login(userDto);
        return new DataResponse<>(200, "로그인 성공", token);
    }

    @PostMapping("/user/signup")
    public CommonResponse signUp(@RequestBody UserDto userDto) {
        userService.signUp(userDto);

        return new CommonResponse(200, "회원가입 성공");
    }

    @GetMapping("/user")
    public DataResponse<UserResponseDto> userDetail(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        UserResponseDto userResponseDto = userService.userDetail(userId);

        return new DataResponse<>(200, "유저 정보 조회 성공", userResponseDto);
    }

    @DeleteMapping("/user")
    public CommonResponse withdrawal(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        userService.withdrawal(userId);

        return new CommonResponse(200, "회원 탈퇴 성공");
    }

    @PostMapping("/user/check")
    public DataResponse<Boolean> checkUser(Principal principal, @RequestBody Map<String, String> passwordMap) {
        Long userId = Long.parseLong(principal.getName());
        boolean isChecked = userService.checkUser(userId, passwordMap.get("password"));

        return new DataResponse<>(200, "유저 확인 완료", isChecked);
    }

    @PutMapping("/user/password")
    public CommonResponse modifyPassword(Principal principal, @RequestBody Map<String, String> passwordMap) {
        Long userId = Long.parseLong(principal.getName());
        userService.modifyPassword(userId, passwordMap.get("password"));

        return new CommonResponse(200, "비밀번호 변경 성공");
    }

}

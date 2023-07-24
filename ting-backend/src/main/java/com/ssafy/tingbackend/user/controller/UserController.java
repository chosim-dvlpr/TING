package com.ssafy.tingbackend.user.controller;

import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/user/login")
    public Map<String, String> login(@RequestBody UserDto userDto) {
        return userService.login(userDto);
    }

    @PostMapping("/user/signup")
    public void signUp(@RequestBody UserDto userDto) {
        userService.signUp(userDto);
    }

    @GetMapping("/user")
    public DataResponse<UserDto> userDetail(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        UserDto userDto = userService.userDetail(userId);

        return new DataResponse<>(200, "유저 정보 조회 성공", userDto);
    }

}

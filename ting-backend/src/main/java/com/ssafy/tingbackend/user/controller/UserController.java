package com.ssafy.tingbackend.user.controller;

import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.user.dto.EmailAuthDto;
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

    @PostMapping("/user/email")
    public DataResponse<String> findEmail(@RequestBody UserDto userDto) {
        String email = userService.findEmail(userDto);

        return new DataResponse<>(200, "이메일 찾기 성공", email);
    }


    @GetMapping("/user/email/{email}")
    public DataResponse<String> requestEmail(@PathVariable String email) {
        // 중복 추가하기==================================
        // mongodb에 insert 추가=============================
        userService.sendEmail(email);
        return new DataResponse<>(200, "이메일 인증 요청 성공");
    }

    @PostMapping("/user/emailauth")
    public DataResponse<String> checkEmail(@RequestBody Map<String, String> request) {
        EmailAuthDto emailAuthDto = userService.getEmailKey(request.get("email"));
        if(emailAuthDto.getEmail().equals(request.get("email"))
            && emailAuthDto.getKey().equals(request.get("authCode"))) {
            return new DataResponse<>(200, "이메일 인증 성공");
        }
        return new DataResponse<>(401, "유효하지 않은 인증 코드");
    }

    @GetMapping("/user/nickname/{nickname}")
    public DataResponse<Boolean> checkNickname(@PathVariable String nickname) {
        boolean isDuplicate = userService.checkNickname(nickname);

        return new DataResponse<>(200, "닉네임 중복 확인 완료", isDuplicate);
    }

}

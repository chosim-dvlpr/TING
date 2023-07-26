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

    /**
     * 로그인 API
     * @param userDto email, password
     * @return access-token, refresh-token
     */
    @PostMapping("/user/login")
    public DataResponse<Map<String, String>> login(@RequestBody UserDto userDto) {
        Map<String, String> token = userService.login(userDto);
        return new DataResponse<>(200, "로그인 성공", token);
    }

    /**
     * 회원가입 API
     * @param userDto all
     * @return Only code and message
     */
    @PostMapping("/user/signup")
    public CommonResponse signUp(@RequestBody UserDto userDto) {
        userService.signUp(userDto);

        return new CommonResponse(200, "회원가입 성공");
    }

    /**
     * 닉네임 중복 확인 API
     * @param nickname 닉네임
     * @return 중복 여부 (true, false)
     */
    @GetMapping("/user/nickname/{nickname}")
    public DataResponse<Boolean> checkNickname(@PathVariable String nickname) {
        boolean isDuplicate = userService.checkNickname(nickname);

        return new DataResponse<>(200, "닉네임 중복 확인 완료", isDuplicate);
    }

    /**
     * 유저 상세 정보 조회 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 유저 상세 정보
     */
    @GetMapping("/user")
    public DataResponse<UserResponseDto> userDetail(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        UserResponseDto userResponseDto = userService.userDetail(userId);

        return new DataResponse<>(200, "유저 정보 조회 성공", userResponseDto);
    }

    /**
     * 회원 탈퇴 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @return Only code and message
     */
    @DeleteMapping("/user")
    public CommonResponse withdrawal(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        userService.withdrawal(userId);

        return new CommonResponse(200, "회원 탈퇴 성공");
    }

    /**
     * 회원 확인 API (비밀번호만 입력)
     * @param principal 로그인한 유저의 id (자동주입)
     * @param passwordMap 비밀번호
     * @return 회원 확인 여부 (true, false)
     */
    @PostMapping("/user/check")
    public DataResponse<Boolean> checkUser(Principal principal, @RequestBody Map<String, String> passwordMap) {
        Long userId = Long.parseLong(principal.getName());
        boolean isChecked = userService.checkUser(userId, passwordMap.get("password"));

        return new DataResponse<>(200, "유저 확인 완료", isChecked);
    }

    /**
     * 비밀번호 변경 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param passwordMap 비밀번호
     * @return Only code and message
     */
    @PutMapping("/user/password")
    public CommonResponse modifyPassword(Principal principal, @RequestBody Map<String, String> passwordMap) {
        Long userId = Long.parseLong(principal.getName());
        userService.modifyPassword(userId, passwordMap.get("password"));

        return new CommonResponse(200, "비밀번호 변경 성공");
    }

    /**
     * 이메일 찾기 API
     * @param userDto 이름, 전화번호
     * @return 이메일
     */
    @PostMapping("/user/email")
    public DataResponse<String> findEmail(@RequestBody UserDto userDto) {
        String email = userService.findEmail(userDto);

        return new DataResponse<>(200, "이메일 찾기 성공", email);
    }


    /**
     * 이메일 인증 요청 API (이메일로 인증코드 전송)
     * @param email 이메일
     * @return Only code and message
     */
    @GetMapping("/user/email/{email}")
    public CommonResponse requestEmail(@PathVariable String email) {
        if (userService.checkDuplicatedEmail(email)) return new CommonResponse(400, "중복된 이메일");
        userService.sendEmail(email);
        return new CommonResponse(200, "이메일 인증 요청 성공");
    }

    /**
     * 이메일 코드 인증 API (인증코드 확인)
     * @param request 이메일, 인증코드
     * @return Only code and message
     */
    @PostMapping("/user/emailauth")
    public CommonResponse checkEmail(@RequestBody Map<String, String> request) {
        userService.validateEmailCode(request.get("email"), request.get("authCode"));
        return new CommonResponse(200, "이메일 인증 성공");
    }

}

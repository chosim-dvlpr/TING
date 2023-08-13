package com.ssafy.tingbackend.user.controller;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.common.security.JwtUtil;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.dto.UserSkinDto;
import com.ssafy.tingbackend.user.service.UserService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;
import java.util.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * 로그인 API
     *
     * @param userDto email, password
     * @return access-token, refresh-token
     */
    @PostMapping("/user/login")
    public DataResponse<Map<String, String>> login(@RequestBody UserDto.Basic userDto) {
        Map<String, String> token = userService.login(userDto);
        return new DataResponse<>(200, "로그인 성공", token);
    }

    /**
     * Refresh Token 재발급 API
     *
     * @param request 요청 http
     * @return access-token, refresh-token
     */
    @PostMapping("/user/refresh")
    public DataResponse<Map<String, String>> refreshToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new CommonException(ExceptionType.JWT_TOKEN_INVALID);
        }
        String token = bearerToken.substring(7);
        Claims claims = JwtUtil.getPayloadAndCheckExpired(token);
        if (!"refresh-token".equals(claims.getSubject())) {
            throw new CommonException(ExceptionType.JWT_TOKEN_INVALID);
        }

        Map<String, String> result = userService.refreshToken(claims.get("userId", String.class));
        return new DataResponse<>(200, "토큰 재발급 성공", result);
    }

    /**
     * 회원가입 API
     *
     * @param userDto all
     * @return Only code and message
     */
    @PostMapping("/user/signup")
    public CommonResponse signUp(@RequestBody UserDto.Signup userDto) {
        userService.signUp(userDto);

        return new CommonResponse(200, "회원가입 성공");
    }

    @PostMapping("/user/profile")
    public CommonResponse profile(@RequestParam("file") MultipartFile file, Principal principal) throws IOException {
        userService.saveProfile(file, Long.parseLong(principal.getName()));
        return new CommonResponse(200, "프로필 등록 성공");
    }

    @PostMapping("/user/profile/noToken")
    public CommonResponse profileNoToken(@RequestParam("file") MultipartFile file, @RequestParam("email") String email,
                                         @RequestParam("password") String password) throws IOException {
        userService.saveProfileNoToken(file, email, password);
        return new CommonResponse(200, "프로필 등록 성공");
    }

    @GetMapping("/user/profile")
    public ResponseEntity<Resource> getProfile(Principal principal) {
        return userService.getProfile(Long.parseLong(principal.getName()));
    }

    /**
     * 프로필 이미지 조회
     */
    @GetMapping("/user/profile/{userId}")
    public ResponseEntity<Resource> getProfile(@PathVariable Long userId) {
        return userService.getProfile(userId);
    }

    @GetMapping("/skin/fish/{fileName}")
    public ResponseEntity<Resource> getFishSkin(@PathVariable String fileName) {
        return userService.getFishSkin(fileName);
    }


    /**
     * 닉네임 중복 확인 API
     *
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
     *
     * @param principal 로그인한 유저의 id (자동주입)
     * @return 유저 상세 정보
     */
    @GetMapping("/user")
    public DataResponse<UserDto.Detail> userDetail(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        UserDto.Detail userResponseDto = userService.userDetail(userId);

        return new DataResponse<>(200, "유저 정보 조회 성공", userResponseDto);
    }

    /**
     * 유저 정보 수정 API
     *
     * @param principal 로그인한 유저의 id (자동주입)
     * @param userDto   수정할 유저 정보 (반드시 모든 정보를 보내야 함)
     * @return Only code and message
     */
    @PutMapping("/user")
    public CommonResponse modifyUser(Principal principal, @RequestBody UserDto.Put userDto) {
        Long userId = Long.parseLong(principal.getName());
        userService.modifyUser(userId, userDto);

        return new CommonResponse(200, "유저 정보 수정 성공");
    }

    /**
     * 회원 탈퇴 API
     *
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
     *
     * @param principal   로그인한 유저의 id (자동주입)
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
     *
     * @param principal   로그인한 유저의 id (자동주입)
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
     *
     * @param userDto 이름, 전화번호
     * @return 이메일
     */
    @PostMapping("/user/email")
    public DataResponse<String> findEmail(@RequestBody UserDto.Basic userDto) {
        String email = userService.findEmail(userDto);

        return new DataResponse<>(200, "이메일 찾기 성공", email);
    }


    /**
     * 이메일 인증 요청 API (이메일로 인증코드 전송)
     *
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
     *
     * @param request 이메일, 인증코드
     * @return Only code and message
     */
    @PostMapping("/user/emailauth")
    public CommonResponse checkEmail(@RequestBody Map<String, String> request) {
        userService.validateEmailCode(request.get("email"), request.get("authCode"));
        return new CommonResponse(200, "이메일 인증 성공");
    }

    /**
     * 전화번호 인증 요청 API (문자로 인증코드 전송)
     *
     * @param phoneNumber 전화번호
     * @return Only code and message
     */
    @GetMapping("/user/phoneauth/{phoneNumber}")
    public CommonResponse requestPhoneNumber(@PathVariable String phoneNumber) {
        userService.authPhoneNumber(phoneNumber);
        return new CommonResponse(200, "전화번호 인증 요청 성공");
    }

    /**
     * 전화번호 인증 코드 확인 API
     *
     * @param requestMap 전화번호, 인증코드
     * @return Only code and message
     */
    @PostMapping("/user/phoneauth")
    public CommonResponse checkPhoneNumber(@RequestBody Map<String, String> requestMap) {
        userService.validatePhoneAuthCode(requestMap.get("phoneNumber"), requestMap.get("authCode"));
        return new CommonResponse(200, "전화번호 인증 성공");
    }

    /**
     * 비밀번호 찾기 API (인증코드 확인)
     *
     * @param request 이메일, 이름, 전화번호
     * @return Only code and message
     */
    @PostMapping("/user/password")
    public CommonResponse findPassword(@RequestBody UserDto.Basic userDto) {
        userService.findPassword(userDto);
        return new CommonResponse(200, "임시 비밀번호 전송 성공");
    }

    @GetMapping("/user/skin")
    public DataResponse<UserSkinDto> getSkin(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        return new DataResponse<>(200, "현재 유저의 어항 반환", userService.getSkin(userId));
    }
}

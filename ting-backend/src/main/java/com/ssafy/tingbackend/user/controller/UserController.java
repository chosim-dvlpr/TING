package com.ssafy.tingbackend.user.controller;

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

    private final UserService authService;

    @PostMapping("/api/login")
    public Map<String, String> login(@RequestBody UserDto userDto) {
        return authService.login(userDto);
    }

    @PostMapping("/user/signup")
    public void signUp(@RequestBody UserDto userDto) {
        authService.signUp(userDto);
    }

    @GetMapping("/api/test")
    public void test(Principal principal) {
        log.info("principal: {}", principal);
        System.out.println(principal.getName());
    }
}

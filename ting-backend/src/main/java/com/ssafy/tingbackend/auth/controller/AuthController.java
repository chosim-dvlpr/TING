package com.ssafy.tingbackend.auth.controller;

import com.ssafy.tingbackend.auth.dto.UserDto;
import com.ssafy.tingbackend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/api/login")
    public Map<String, String> login(@RequestBody UserDto userDto) {
        return authService.login(userDto);
    }

    @GetMapping("/api/test")
    public void test(Authentication authentication, Principal principal) {
        log.info("principal: {}", principal);
        log.info("authentication: {}", authentication);
    }
}

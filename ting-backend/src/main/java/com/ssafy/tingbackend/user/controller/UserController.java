package com.ssafy.tingbackend.user.controller;

import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.security.Principal;
import java.time.LocalDateTime;
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

    @GetMapping("/api/test")
    public void test(Authentication authentication, Principal principal) {
        log.info("principal: {}", principal);
        log.info("authentication: {}", authentication);
    }
}

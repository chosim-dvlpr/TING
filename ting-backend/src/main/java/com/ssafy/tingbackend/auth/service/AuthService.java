package com.ssafy.tingbackend.auth.service;

import com.ssafy.tingbackend.auth.dto.UserDto;
import com.ssafy.tingbackend.auth.repository.AuthRepository;
import com.ssafy.tingbackend.entity.User;
import com.ssafy.tingbackend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    public Map<String, String> login(UserDto userDto) {
        System.out.println(userDto);
        User user = authRepository.findByEmailAndPassword(userDto.getEmail(), userDto.getPassword())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 E-MAIL이거나, 잘못된 비밀번호입니다."));

        System.out.println(user);
        Map<String, String> result = new HashMap<>();
        result.put("access-token", JwtUtil.generateAccessToken(String.valueOf(user.getId())));
        result.put("refresh-token", JwtUtil.generateRefreshToken(String.valueOf(user.getId())));

        return result;
    }
}

package com.ssafy.tingbackend.user.service;

import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.common.security.JwtAuthenticationProvider;
import com.ssafy.tingbackend.common.security.JwtUtil;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtAuthenticationProvider jwtAuthenticationProvider;
    private final PasswordEncoder passwordEncoder;

    public Map<String, String> login(UserDto userDto) {
        log.info("{} 유저 로그인 시도", userDto.getEmail());
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword());

        Authentication authenticate = jwtAuthenticationProvider.authenticate(authenticationToken);
        User principal = (User) authenticate.getPrincipal();

        String accessToken = JwtUtil.generateAccessToken(String.valueOf(principal.getId()));
        String refreshToken = JwtUtil.generateRefreshToken(String.valueOf(principal.getId()));

        Map<String, String> result = new HashMap<>();
        result.put("access-token", accessToken);
        result.put("refresh-token", refreshToken);

        return result;
    }

    public void signUp(UserDto userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        userRepository.save(user);
    }


}

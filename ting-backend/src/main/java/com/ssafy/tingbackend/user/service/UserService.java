package com.ssafy.tingbackend.user.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.common.security.JwtAuthenticationProvider;
import com.ssafy.tingbackend.common.security.JwtUtil;
import com.ssafy.tingbackend.entity.user.AdditionalInfo;
import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.dto.UserResponseDto;
import com.ssafy.tingbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    @Transactional
    public UserResponseDto userDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ExceptionType.USER_NOT_FOUND));

        List<AdditionalInfo> hobbyAdditional = new ArrayList<>();
        List<AdditionalInfo> styleAdditional = new ArrayList<>();
        List<AdditionalInfo> personalityAdditional = new ArrayList<>();

        user.getUserHobbys().forEach(hobby -> hobbyAdditional.add(hobby.getAdditionalInfo()));
        user.getUserStyles().forEach(style -> styleAdditional.add(style.getAdditionalInfo()));
        user.getUserPersonalities().forEach(personality -> personalityAdditional.add(personality.getAdditionalInfo()));

        return UserResponseDto.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .nickname(user.getNickname())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .region(user.getRegion() == null ? "" : user.getRegion().getName())
                .birth(user.getBirth())
                .profileImage(user.getProfileImage())
                .height(user.getHeight())
                .introduce(user.getIntroduce())
                .mbtiCode(user.getMbtiCode())
                .drinkingCode(user.getDrinkingCode())
                .smokingCode(user.getSmokingCode())
                .religionCode(user.getReligionCode())
                .jobCode(user.getJobCode())
                .userHobbys(hobbyAdditional)
                .userStyles(styleAdditional)
                .userPersonalities(personalityAdditional)
                .build();
    }
}

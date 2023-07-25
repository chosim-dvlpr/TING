package com.ssafy.tingbackend.user.service;

import com.ssafy.tingbackend.common.exception.CommonException;
import com.ssafy.tingbackend.common.exception.ExceptionType;
import com.ssafy.tingbackend.entity.type.SidoType;
import com.ssafy.tingbackend.entity.user.*;
import com.ssafy.tingbackend.common.security.JwtAuthenticationProvider;
import com.ssafy.tingbackend.common.security.JwtUtil;
import com.ssafy.tingbackend.user.dto.UserDto;
import com.ssafy.tingbackend.user.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AdditionalInfoRepository additionalInfoRepository;
    private final UserHobbyRepository userHobbyRepository;
    private final UserPersonalityRepository userPersonalityRepository;
    private final UserStyleRepository userStyleRepository;
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
        userDto.encodePassword(passwordEncoder.encode(userDto.getPassword()));  // 비밀번호 암호화

        // 기본 정보 UserDto -> User 변환
        ModelMapper modelMapper = new ModelMapper();
        User user = modelMapper.map(userDto, User.class);

        // 지역 정보 enum 타입으로 변환
        user.setRegion(SidoType.getEnumType(userDto.getRegion()));

        // mbti, 음주, 직업, 종교, 흡연 AdditionalInfo 객체로 변환
        user.setMbtiCode(getAdditionalInfo(userDto.getMbtiCode()));
        user.setDrinkingCode(getAdditionalInfo(userDto.getDrinkingCode()));
        user.setJobCode(getAdditionalInfo(userDto.getJobCode()));
        user.setReligionCode(getAdditionalInfo(userDto.getReligionCode()));
        user.setSmokingCode(getAdditionalInfo(userDto.getSmokingCode()));

        // 취미, 성격, 선호 스타일 각 매핑 객체로 변환
        ArrayList<UserHobby> userHobbies = new ArrayList<>();
        for(Long hobbyCode : userDto.getHobbyCodeList()) {
            UserHobby userHobby = new UserHobby();
            userHobby.setUser(user);
            userHobby.setAdditionalInfo(getAdditionalInfo(hobbyCode));
            userHobbies.add(userHobby);
        }

        ArrayList<UserPersonality> userPersonalities = new ArrayList<>();
        for(Long personalityCode : userDto.getPersonalityCodeList()) {
            UserPersonality userPersonality = new UserPersonality();
            userPersonality.setUser(user);
            userPersonality.setAdditionalInfo(getAdditionalInfo(personalityCode));
            userPersonalities.add(userPersonality);
        }

        ArrayList<UserStyle> userStyles = new ArrayList<>();
        for(Long styleCode : userDto.getStyleCodeList()) {
            UserStyle userStyle = new UserStyle();
            userStyle.setUser(user);
            userStyle.setAdditionalInfo(getAdditionalInfo(styleCode));
            userStyles.add(userStyle);
        }
        System.out.println(user);

        // DB에 저장
        userRepository.save(user);
        userHobbyRepository.saveAll(userHobbies);
        userPersonalityRepository.saveAll(userPersonalities);
        userStyleRepository.saveAll(userStyles);
    }

    private AdditionalInfo getAdditionalInfo(Long code) {
        return additionalInfoRepository.findById(code)
                .orElseThrow(() -> new CommonException(ExceptionType.ADDITOIONAL_INFO_NOT_FOUND));
    }
}

package com.ssafy.tingbackend.user.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private Long userId;
    private String email;
    private String name;
    private String nickname;
    private String phoneNumber;
    private String gender;
    private String region;
    private LocalDate birth;
    private String profileImage;
    private Long point;
    private Integer height;
    private String introduce;

    // 직업, 음주, 흡연, 종교, MBTI, 성격, 취미, 스타일
    private AdditionalInfoDto jobCode;
    private AdditionalInfoDto drinkingCode;
    private AdditionalInfoDto religionCode;
    private AdditionalInfoDto mbtiCode;
    private AdditionalInfoDto smokingCode;

    List<AdditionalInfoDto> userHobbys = new ArrayList<>();
    List<AdditionalInfoDto> userStyles = new ArrayList<>();
    List<AdditionalInfoDto> userPersonalities = new ArrayList<>();
}

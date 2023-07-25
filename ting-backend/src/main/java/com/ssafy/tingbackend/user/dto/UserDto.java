package com.ssafy.tingbackend.user.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String userId;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String phoneNumber;
    private Character gender;
    private String region;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate birth;    // 2000-10-31 형태

    private String profileImage;
    private int height;
    private String introduce;

    private long mbtiCode;
    private long drinkingCode;
    private long smokingCode;
    private long religionCode;
    private long jobCode;

    private List<Long> hobbyCodeList;
    private List<Long> styleCodeList;
    private List<Long> personalityCodeList;

    public void encodePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}

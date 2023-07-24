package com.ssafy.tingbackend.user.dto;

import com.ssafy.tingbackend.entity.type.SidoType;
import com.ssafy.tingbackend.entity.user.User;
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

    private int mbtiCode;
    private int drinkingCode;
    private int smokingCode;
    private int religionCode;
    private int jobCode;

    private List<Long> hobbyCodeList;
    private List<Long> styleCodeList;
    private List<Long> personalityCodeList;

    public void encodePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public User toEntity() {
        return User.builder()
                .email(email)
                .password(password)
                .name(name)
                .nickname(nickname)
                .phoneNumber(phoneNumber)
                .gender(gender)
                .region(SidoType.valueOf(region))
                .birth(birth)
                .profileImage(profileImage)
                .height(height)
                .introduce(introduce)
//                .mbtiCode()  // 참조 타입들 어떻게 바꾸는거지..
                // drinking, smoking, religion, job 추가해야함
                .build();
    }
}

package com.ssafy.tingbackend.user.dto;

import com.ssafy.tingbackend.entity.type.SidoType;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


public class UserDto {
    @Getter
    @Setter
    public static class Basic {
        private Long userId;
        private String email;
        private String password;
        private String name;
        private String phoneNumber;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Signup {
        private Long userId;
        private String email;
        private String password;
        private String name;
        private String nickname;
        private String phoneNumber;
        private String gender;
        private String region;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate birth;    // 2000-10-31 형태

        private String profileImage;
        private int height;
        private String introduce;

        private Long mbtiCode;
        private Long drinkingCode;
        private Long smokingCode;
        private Long religionCode;
        private Long jobCode;

        private List<Long> hobbyCodeList;
        private List<Long> styleCodeList;
        private List<Long> personalityCodeList;

        public void encodePassword(String encodedPassword) {
            this.password = encodedPassword;
        }
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Detail {
        private Long userId;
        private String email;
        private String password;
        private String name;
        private String nickname;
        private String phoneNumber;
        private String gender;
        private SidoType region;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        private LocalDate birth;    // 2000-10-31 형태

        private String profileImage;
        private int height;
        private String introduce;

        private AdditionalInfoDto mbtiCode;
        private AdditionalInfoDto drinkingCode;
        private AdditionalInfoDto smokingCode;
        private AdditionalInfoDto religionCode;
        private AdditionalInfoDto jobCode;

        private String fishSkin;

        List<AdditionalInfoDto> userHobbys = new ArrayList<>();
        List<AdditionalInfoDto> userStyles = new ArrayList<>();
        List<AdditionalInfoDto> userPersonalities = new ArrayList<>();

        public static UserDto.Detail of(User user, List<AdditionalInfoDto> hobbyAdditional, List<AdditionalInfoDto> styleAdditional, List<AdditionalInfoDto> personalityAdditional) {
            return UserDto.Detail.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .nickname(user.getNickname())
                    .phoneNumber(user.getPhoneNumber())
                    .gender(user.getGender())
                    .region(user.getRegion())
                    .birth(user.getBirth())
                    .profileImage(user.getProfileImage())
                    .height(user.getHeight())
                    .introduce(user.getIntroduce())
                    .mbtiCode(AdditionalInfoDto.of(user.getMbtiCode()))
                    .drinkingCode(AdditionalInfoDto.of(user.getDrinkingCode()))
                    .smokingCode(AdditionalInfoDto.of(user.getSmokingCode()))
                    .religionCode(AdditionalInfoDto.of(user.getReligionCode()))
                    .jobCode(AdditionalInfoDto.of(user.getJobCode()))
                    .userHobbys(hobbyAdditional)
                    .userStyles(styleAdditional)
                    .userPersonalities(personalityAdditional)
                    .fishSkin(user.getFishSkin().getImagePath())
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Put {
        private Long userId;
        private String phoneNumber;
        private String region;
        private String profileImage;
        private int height;
        private String introduce;

        private Long mbtiCode;
        private Long drinkingCode;
        private Long smokingCode;
        private Long religionCode;
        private Long jobCode;

        private List<Long> hobbyCodeList;
        private List<Long> styleCodeList;
        private List<Long> personalityCodeList;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Info {
        private String nickname;
        private String gender;
        private SidoType region;

        private String profileImage;
        private int height;
        private String introduce;

        private AdditionalInfoDto mbtiCode;
        private AdditionalInfoDto drinkingCode;
        private AdditionalInfoDto smokingCode;
        private AdditionalInfoDto religionCode;
        private AdditionalInfoDto jobCode;

        private String fishSkin;

        List<AdditionalInfoDto> userHobbys = new ArrayList<>();
        List<AdditionalInfoDto> userStyles = new ArrayList<>();
        List<AdditionalInfoDto> userPersonalities = new ArrayList<>();

        public static UserDto.Info of(User user, List<AdditionalInfoDto> hobbyAdditional, List<AdditionalInfoDto> styleAdditional, List<AdditionalInfoDto> personalityAdditional) {
            return UserDto.Info.builder()
                    .nickname(user.getNickname())
                    .gender(user.getGender())
                    .region(user.getRegion())
                    .profileImage(user.getProfileImage())
                    .height(user.getHeight())
                    .introduce(user.getIntroduce())
                    .mbtiCode(AdditionalInfoDto.of(user.getMbtiCode()))
                    .drinkingCode(AdditionalInfoDto.of(user.getDrinkingCode()))
                    .smokingCode(AdditionalInfoDto.of(user.getSmokingCode()))
                    .religionCode(AdditionalInfoDto.of(user.getReligionCode()))
                    .jobCode(AdditionalInfoDto.of(user.getJobCode()))
                    .userHobbys(hobbyAdditional)
                    .userStyles(styleAdditional)
                    .userPersonalities(personalityAdditional)
                    .fishSkin(user.getFishSkin().getImagePath())
                    .build();
        }
    }
}

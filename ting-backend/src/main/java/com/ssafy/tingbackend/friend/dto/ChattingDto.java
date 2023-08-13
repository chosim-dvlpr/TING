package com.ssafy.tingbackend.friend.dto;

import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChattingDto {
    private Long chattingId;
    private String lastChattingContent;
    private LocalDateTime lastChattingTime;
    private ChattingType state;
    private BigDecimal temperature;
    private String profileImage;
    private String nickname;
    private Long userId;
    private Integer unread;

    private String fishSkin;

    public static ChattingDto of(Chatting chatting, User friend, Integer unread) {
        return ChattingDto.builder()
                .chattingId(chatting.getId())
                .lastChattingContent(chatting.getLastChattingContent())
                .lastChattingTime(chatting.getLastChattingTime())
                .state(chatting.getState())
                .temperature(chatting.getTemperature())
                .profileImage(friend.getProfileImage())
                .nickname(friend.getNickname())
                .userId(friend.getId())
                .unread(unread)
                .fishSkin(friend.getFishSkin().getImagePath())
                .build();
    }
}

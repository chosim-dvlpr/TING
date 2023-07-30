package com.ssafy.tingbackend.friend.dto;

import com.ssafy.tingbackend.entity.chatting.Chatting;
import com.ssafy.tingbackend.entity.type.ChattingType;
import com.ssafy.tingbackend.entity.user.User;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChattingDto {
    private Long chattingId;
    private String lastChattingContent;
    private ChattingType state;
    private BigDecimal temperature;
    private String profileImage;
    private String nickname;
    private Long userId;
    private Integer unreaded;

    public static ChattingDto of(Chatting chatting, User friend) {
        return ChattingDto.builder()
                .chattingId(chatting.getId())
                .lastChattingContent(chatting.getLastChattingContent())
                .state(chatting.getState())
                .temperature(chatting.getTemperature())
                .profileImage(friend.getProfileImage())
                .nickname(friend.getNickname())
                .userId(friend.getId())
                .build();
    }
}

package com.ssafy.tingbackend.chatting.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString(of = {"type", "roomId", "userId","message"})
public class MessageRequestDto {
    private String type;

    private Long roomId;

    private Long userId;

    private String message;

    public MessageRequestDto() {

    }

    public MessageRequestDto(String type, Long roomId, Long userId, String message) {
        this.type = type;
        this.roomId = roomId;
        this.userId = userId;
        this.message = message;
    }
}

package com.ssafy.tingbackend.chatting.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString(of = {"type", "roomId", "userId","message"})
public class MessageResponseDto {
    private final Long id;

    private final String type;

    private final String value;

    public MessageResponseDto(Long id, String type, String value) {
        this.id = id;
        this.type = type;
        this.value = value;
    }

}

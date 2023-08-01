package com.ssafy.tingbackend.chatting.dto;

public class MessageRequestDto {
    private String type;

    private Long roomId;

    private Long userId;

    private String message;

    public MessageRequestDto() {

    }

    public MessageRequestDto(String type,
                             Long roomId,
                             Long userId,
                             String message) {
        this.type = type;
        this.roomId = roomId;
        this.userId = userId;
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public Long getRoomId() {
        return roomId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }
}

package com.ssafy.tingbackend.friend.dto;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Document(collection = "chattingMessage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(of = {"id", "chattingId", "userId", "content", "sendTime"})
public class ChattingMessageDto {
    @Id
    private String id;
    private Long chattingId;
    private Long userId;
    private String content;
    private LocalDateTime sendTime;
    private String nickname;

    public ChattingMessageDto(Long chattingId, Long userId, String content, String nickname) {
        this.chattingId = chattingId;
        this.userId = userId;
        this.content = content;
        this.sendTime = LocalDateTime.now();
        this.nickname = nickname;
    }
}

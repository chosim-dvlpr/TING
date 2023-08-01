package com.ssafy.tingbackend.friend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.time.LocalDateTime;

@Document(collection = "chattingMessage")
@Getter
@Setter
@NoArgsConstructor
@ToString(of = {})
public class ChattingMessageDto {
    @Id
    private String id;
    private Long chattingId;
    private Long userId;
    private String content;
    private LocalDateTime sendTime;

    public ChattingMessageDto(Long chattingId, Long userId, String content) {
        this.chattingId = chattingId;
        this.userId = userId;
        this.content = content;
        this.sendTime = LocalDateTime.now();
    }
}

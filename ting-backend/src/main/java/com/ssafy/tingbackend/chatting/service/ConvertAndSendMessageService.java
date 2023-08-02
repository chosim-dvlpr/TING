package com.ssafy.tingbackend.chatting.service;

import com.ssafy.tingbackend.friend.dto.ChattingMessageDto;
import com.ssafy.tingbackend.friend.repository.ChattingMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConvertAndSendMessageService {
    private final SimpMessagingTemplate template;
    private final ChattingMessageRepository chattingMessageRepository;

    public void convertAndSendMessage(Long roomId, Long userId, String content) {
        ChattingMessageDto chattingMessageDto = new ChattingMessageDto(roomId, userId, content);
//        chattingMessageRepository.save(chattingMessageDto);
        System.out.println(userId);
        template.convertAndSendToUser(String.valueOf((userId+1)%3), "/list", chattingMessageDto);
        template.convertAndSend(
            "/subscription/chat/room/" + roomId,
                chattingMessageDto
        );
    }
}

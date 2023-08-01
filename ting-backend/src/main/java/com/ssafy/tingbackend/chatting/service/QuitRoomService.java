package com.ssafy.tingbackend.chatting.service;

import com.ssafy.tingbackend.chatting.dto.MessageResponseDto;
import com.ssafy.tingbackend.chatting.utils.MessageIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class QuitRoomService {
    @Autowired
    private SimpMessagingTemplate template;

    public void quitRoom(String type,
                         Long roomId,
                         Long userId) {
        template.convertAndSend(
            "/subscription/chat/room/" + roomId,
            new MessageResponseDto(
                MessageIdGenerator.generateId(),
                type,
                "사용자 " + userId + " 님이 "
                    + "채팅방 " + roomId + "에서 나갔습니다."
            )
        );
    }
}

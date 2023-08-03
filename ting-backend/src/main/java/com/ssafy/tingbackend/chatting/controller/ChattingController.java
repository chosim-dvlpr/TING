package com.ssafy.tingbackend.chatting.controller;


import com.ssafy.tingbackend.chatting.dto.MessageRequestDto;
import com.ssafy.tingbackend.chatting.service.ChattingService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@RestController
@RequiredArgsConstructor
public class ChattingController {
    private final ChattingService chattingService;


    @MessageMapping("/chat/enter")
    public void enter(MessageRequestDto messageRequestDto) {
        chattingService.enter(messageRequestDto);
    }

    @MessageMapping("/chat/quit")
    public void quit(MessageRequestDto messageRequestDto) {
        chattingService.quit(messageRequestDto);
    }

    @MessageMapping("/chat/message")
    public void message(MessageRequestDto messageRequestDto) {
        chattingService.convertAndSendMessage(
            messageRequestDto.getRoomId(),
            messageRequestDto.getUserId(),
            messageRequestDto.getMessage()
        );
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        chattingService.checkAndReset();
    }

//    @MessageExceptionHandler
//    public String exception() {
//        return "Error has occurred.";
//    }
}

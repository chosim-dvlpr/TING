package com.ssafy.tingbackend.chatting.controller;


import com.ssafy.tingbackend.chatting.dto.MessageRequestDto;
import com.ssafy.tingbackend.chatting.service.ChattingService;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChattingController {
    private final ChattingService chattingService;

    /**
     * 채팅 목록 조회 API
     * @param chattingId 채팅 방 번호
     * @return 채팅 목록(chattingList), 온도(temperature)
     */
    @GetMapping("/chatting/{chattingId}")
    public DataResponse<Map<String, Object>> chattingList(@PathVariable Long chattingId) {
        log.info("채팅 목록 조회 API, chattingId = {}", chattingId);
        Map<String, Object> result = chattingService.chattingList(chattingId);
        return new DataResponse<>(200, "채팅 목록 조회 성공", result);
    }

    /**
     * 리스트 -> 방 이동
     * @param messageRequestDto type, rommId, userId
     */
    @MessageMapping("/chat/enter")
    public void enter(MessageRequestDto messageRequestDto) {
        log.info("리스트 -> 방 이동 messageRequestDto : {}", messageRequestDto);
        chattingService.enter(messageRequestDto);
    }

    /**
     * 방 -> 리스트 이동
     * @param messageRequestDto type, rommId, userId
     */
    @MessageMapping("/chat/quit")
    public void quit(MessageRequestDto messageRequestDto) {
        log.info("방 -> 리스트 이동 messageRequestDto : {}", messageRequestDto);
        chattingService.quit(messageRequestDto);
    }

    /**
     * 방 안에서  메세지 보내기
     * @param messageRequestDto type, roomId, userId, message
     */
    @MessageMapping("/chat/message")
    public void message(MessageRequestDto messageRequestDto) {
        log.info("방 안에서 메세지 보내기 messageRequestDto : {}", messageRequestDto);
        chattingService.convertAndSendMessage(
            messageRequestDto.getRoomId(),
            messageRequestDto.getUserId(),
            messageRequestDto.getMessage()
        );
    }

    /**
     * 웹 소캣 연결 끊길 때 발생
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        log.info("웹 소캣 연결 끊김");
        chattingService.checkAndReset();
    }


    /**
     * 임시=========채팅 삭제 API
     */
    @GetMapping("/chatting/delete")
    public CommonResponse deleteMessages() {
        log.info("채팅 삭제 API");
        chattingService.deleteMessages();
        return new CommonResponse();
    }
//    @MessageExceptionHandler
//    public String exception() {
//        return "Error has occurred.";
//    }
}

package com.ssafy.tingbackend.matching.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.tingbackend.matching.dto.WebSocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@Slf4j
@RequiredArgsConstructor
public class MatchingWebSocketHandler extends TextWebSocketHandler {

    private final MatchingService matchingService;

    // 웹소켓 연결
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("웹소켓 연결 - {}", session.getId());
        matchingService.connectSocket(session);
    }

    // 양방향 데이터 통신 - 클라이언트에서 메세지를 보내오는 경우
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        log.info("양방향 데이터 통신 - {}", session.getId());

        ObjectMapper objectMapper = new ObjectMapper();
        WebSocketMessage webSocketMessage = objectMapper.readValue(message.getPayload(), WebSocketMessage.class);

        if(webSocketMessage.getType().equals("jwt")) {
            matchingService.waitForMatching(session.getId(), webSocketMessage.getData().get("token"));
        }
        if(webSocketMessage.getType().equals("accept")) {
            matchingService.acceptMatching(session.getId());
        }
        if(webSocketMessage.getType().equals("reject")) {
            matchingService.rejectMatching(session.getId());
        }
    }

    // 소켓 연결 종료
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("소켓 연결 종료 - {}", session.getId());
        matchingService.finishWaiting(session.getId());
    }

    // 소켓 통신 에러
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.info("소켓 통신 에러 - {}", session.getId());
        matchingService.finishWaiting(session.getId());
    }

}

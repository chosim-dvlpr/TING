package com.ssafy.tingbackend.chatting.service;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

//    @EventListener
//    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        String sessionId = headerAccessor.getSessionId();
//
//        System.out.println(event.getMessage());
//        System.out.println(headerAccessor.getMessage());
//        System.out.println(headerAccessor.getDestination());
//        // 연결이 끊어졌을 때 실행할 로직 작성
//        System.out.println("WebSocket 연결이 끊어졌습니다. Session ID: " + sessionId);
//    }
}
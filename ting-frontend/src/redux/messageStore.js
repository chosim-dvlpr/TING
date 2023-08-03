import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { messageService } from '../component/friend/MessageService';

const baseUrl = 'https://i9b107.p.ssafy.io:5157';

export default class MessageStore {
  constructor() {
    this.listeners = new Set();
    // this.id = Math.ceil(Math.random() * 1000);
    // 본인의 아이디
    this.userId = localStorage.getItem("userId");

    this.socket = null;
    this.client = null;
    this.connected = false;

    this.roomIndices = [1, 2, 3];

    this.currentRoomIndex = 0;
    this.messageEntered = '';

    this.messageLogs = [];
  }

  // 채팅방 연결
  connect(roomIndex) {
    this.socket = new SockJS(`${baseUrl}/chat`);
    this.client = Stomp.over(this.socket);

    this.currentRoomIndex = roomIndex;

    this.subscribeMessageBroker(this.currentRoomIndex);

    this.connected = true;
    this.publish();
  }

  // 채팅방 구독 연결
  subscribeMessageBroker(roomIndex) {
    this.client.connect(
      {},
      () => {
        this.client.subscribe(
          `/subscription/chat/room/${roomIndex}`,
          (messageReceived) => this.receiveMessage(messageReceived),
          {},
        );
        
        // 엔터 입력 시 메세지 전송하기
        this.sendMessage({ type: 'enter' });
      },
    );
  }

  // 연결 해제
  disconnect() {
    this.sendMessage({ type: 'quit' });

    this.client.unsubscribe();
    this.client.disconnect();

    this.connected = false; // 연결 해제 상태
    this.currentRoomIndex = 0; // 방번호 초기화
    this.messageEntered = '';
    this.messageLogs = [];
    this.publish();
  }

  // 메세지 내용 작성
  // value : 입력값
  changeInput(value) {
    this.messageEntered = value; // 엔터를 누르면 messageEntered에 입력값 저장
    this.publish();
  }

  // 메세지 전송 함수
  sendMessage({ type }) {
    // type이 message면 message 변수에 입력값을 저장
    const message = type === 'message'
      ? this.messageEntered
      : '';

    // messageService의 sendMessage 함수 실행
    // sendMessage 함수 : messageTosend 내용 보냄
    messageService.sendMessage({
      client: this.client,
      messageToSend: {
        type,
        // id: this.id,
        roomId: this.currentRoomIndex,
        userId: this.userId,
        message,
      },
    });

    this.messageEntered = '';
    this.publish();
  }

  receiveMessage(messageReceived) {
    const message = JSON.parse(messageReceived.body);
    this.messageLogs = [...this.messageLogs, this.formatMessage(message)];
    this.publish();
  }

  formatMessage(message) {
    return {
      id: message.id,
      chattingId: message.chattingId, // 채팅방번호 - DB에서 가져오기 (API)
      userId: message.userId, // DB 저장되어있는 유저ID로 보내기 - 보내는 사람 아이디
      content: message.content,
      sendTime: new Date().toLocaleTimeString(),
      value: `${message.userId} ${message.content} (${new Date().toLocaleTimeString()})`,
      // private String id;
      // private Long chattingId;
      // private Long userId;
      // private String content;
      // private LocalDateTime sendTime;
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  publish() {
    this.listeners.forEach((listener) => listener());
  }
}

export const messageStore = new MessageStore();

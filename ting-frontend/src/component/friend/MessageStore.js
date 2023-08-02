/* eslint-disable class-methods-use-this */

// import Stomp from 'stompjs';
// import SockJS from 'sockjs-client';
// import { messageService } from '../services/MessageService';

// const baseUrl = 'http://localhost:8002';

import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// import MessageService from './MessageService';
import { messageService } from './MessageService';

// const baseUrl = 'https://localhost:8080';
const baseUrl = 'https://i9b107.p.ssafy.io:5157';

/* eslint-disable class-methods-use-this */


export default class MessageStore {
  constructor() {
    this.listeners = new Set();

    this.userId = Math.ceil(Math.random() * 1000);

    this.socket = null;
    this.client = null;
    this.connected = false;

    this.roomIndices = [1, 2, 3];

    this.currentRoomIndex = 0;
    this.messageEntered = '';

    this.messageLogs = [];
  }

  connect(roomIndex) {
    this.socket = new SockJS(`${baseUrl}/chat`);
    this.client = Stomp.over(this.socket);

    this.currentRoomIndex = roomIndex;

    this.subscribeMessageBroker(this.currentRoomIndex);

    this.connected = true;
    this.publish();
  }

  subscribeMessageBroker(roomIndex) {
    this.client.connect(
      {},
      () => {
        this.client.subscribe(
          `/subscription/chat/room/${roomIndex}`,
          (messageReceived) => this.receiveMessage(messageReceived),
          {},
        );

        this.sendMessage({ type: 'enter' });
      },
    );
  }

  disconnect() {
    this.sendMessage({ type: 'quit' });

    this.client.unsubscribe();
    this.client.disconnect();

    this.connected = false;
    this.currentRoomIndex = 0;
    this.messageEntered = '';
    this.messageLogs = [];
    this.publish();
  }

  changeInput(value) {
    this.messageEntered = value;
    this.publish();
  }

  sendMessage({ type }) {
    const message = type === 'message'
      ? this.messageEntered
      : '';

    messageService.sendMessage({
      client: this.client,
      messageToSend: {
        type,
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
    console.log('----',message)
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

// import React, { useState, useEffect, useRef } from 'react';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';

// import MessageService from './MessageService';

// const baseUrl = 'http://localhost:3000';

// export default function MessageStore() {
//   const messageRef = useRef('');

//   const [userId] = useState(Math.ceil(Math.random() * 1000));
//   const [socket, setSocket] = useState(null);
//   const [client, setClient] = useState(null);
//   const [connected, setConnected] = useState(false);
//   // const [roomIndices] = useState([1, 2, 3]);
//   const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
//   const [messageEntered, setMessageEntered] = useState('');
//   const [messageLogs, setMessageLogs] = useState([]);

//   const formatMessage = (message) => {
//     return {
//       id: message.id,
//       value: `${message.value} (${new Date().toLocaleTimeString()})`,
//     };
//   };

//   const connect = (roomIndex) => {
//     setSocket(new SockJS(`${baseUrl}/chat`));
//     setClient(Stomp.over(socket));

//     setCurrentRoomIndex(roomIndex);

//     subscribeMessageBroker(currentRoomIndex);

//     setConnected(true);
//     publish();
//   };

//   const subscribeMessageBroker = (roomIndex) => {
//     client.connect({}, () => {
//       client.subscribe(
//         `/subscription/chat/room/${roomIndex}`,
//         (messageReceived) => receiveMessage(messageReceived),
//         {},
//       );

//       sendMessage({ type: 'enter' });
//     });
//   };

//   const disconnect = () => {
//     sendMessage({ type: 'quit' });

//     client.unsubscribe();
//     client.disconnect();

//     setConnected(false);
//     setCurrentRoomIndex(0);
//     setMessageEntered('');
//     setMessageLogs([]);
//     publish();
//   };

//   const changeInput = (value) => {
//     setMessageEntered(value);
//     publish();
//   };

//   const sendMessage = ({ type }) => {
//     const message = type === 'message' ? messageEntered : '';
//     // const message = type === 'message' ? messageRef.current : '';

//     MessageService.sendMessage({
//       client: client,
//       messageToSend: {
//         type,
//         roomId: currentRoomIndex,
//         userId: userId,
//         message,
//       },
//     });

//     setMessageEntered('');
//     publish();
//   };

//   const receiveMessage = (messageReceived) => {
//     const message = JSON.parse(messageReceived.body);
//     setMessageLogs((prevLogs) => [...prevLogs, formatMessage(message)]);
//     publish();
//   };

//   const [listeners, setListeners] = useState(new Set());

//   const subscribe = (listener) => {
//     setListeners((prevListeners) => new Set(prevListeners).add(listener));
//   };

//   const unsubscribe = (listener) => {
//     setListeners((prevListeners) => {
//       const updatedListeners = new Set(prevListeners);
//       updatedListeners.delete(listener);
//       return updatedListeners;
//     });
//   };

//   const publish = () => {
//     listeners.forEach((listener) => listener());
//   };

//   // Clean up when the component is unmounted
//   useEffect(() => {
//     return () => {
//       if (client) {
//         client.unsubscribe();
//         client.disconnect();
//       }
//     };
//   }, [client]);

//   useEffect(() => {
//     if (socket) {
//       setClient(Stomp.over(socket));
//     }
//   }, [socket]);

//   useEffect(() => {
//     messageRef.current = messageEntered;
//   }, [messageEntered]);

//   return {
//     connect,
//     disconnect,
//     changeInput,
//     sendMessage,
//     subscribe,
//     unsubscribe,
//     connected,
//     currentRoomIndex,
//     messageEntered,
//     messageLogs,
//   };
// }

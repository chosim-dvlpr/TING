// import React, { useCallback, useRef, useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import FriendProfile from "./FriendProfile";
// import * as StompJs from "@stomp/stompjs";
// // import * as SockJS from 'sockjs-client'


// export default function ChatRoom() {
//   let navigate = useNavigate();
//   let [isProfileModal, setIsProfileModal] = useState(false);
//   let [friendId, setFriendId] = useState(1); // 초기값은 ""으로 설정해두기

//   const param = useParams(); // 채널을 구분하는 식별자
//   const chatroomId = param.chatroomId;
//   // const token = JSON.stringify(window.localStorage.getItem("token")); // 현재 로그인 된 사용자의 토큰
//   const token = "123123"

//   let [client, changeClient] = useState(null);
//   const [chat, setChat] = useState(""); // 입력된 chat을 받을 변수
//   const [chatList, setChatList] = useState([]); // 채팅 기록

//   // userSlice.js에 저장된 로그인된 유저의 코드를 받음
//   // const userId = useSelector((state) => {
//   //   return state.user.userCode;
//   // });
//   const userId = 1

//   //컴포넌트가 변경될 때 객체가 유지되어야하므로 'ref'로 저장

//   // 내가 보낸 메시지, 받은 메시지에 각각의 스타일을 지정해 주기 위함
//   const msgBox = chatList.map((item, idx) => {
//     if (Number(item.sender)!== userId) {
//       return (
//         <div key={idx}>
//           <div>
//           </div>
//           <div>
//             <span>{item.data}</span>
//           </div>
//           <span>{item.date}</span>
//         </div>
//       );
//     } else {
//       return (
//         <div key={idx}>
//           <div>
//             <span>{item.data}</span>
//           </div>
//           <span>{item.date}</span>
//         </div>
//       );
//     }
//   });

//   const connect = () => {
//     // 소켓 연결
//     try {
//       const clientdata = new StompJs.Client({
//         brokerURL: "ws://localhost:3000/test",
//         connectHeaders: {
//           login: "", // 로그인 정보 넣기
//           passcode: "password",
//         },
//         debug: function (str) {
//           console.log("======",str); // 디버깅을 위한 콘솔 출력
//         },
//         reconnectDelay: 5000, // 자동 재 연결
//         heartbeatIncoming: 4000, // 입력 heartbeat 주기
//         heartbeatOutgoing: 4000, // 출력 heartbeat 주기
//       });


//       // 구독
//       clientdata.onConnect = function () {
//         clientdata.subscribe("/sub/channels/" + chatroomId, callback); // 메세지 수신하는 callback함수
//       };

//       clientdata.activate(); // 클라이언트 활성화
//       changeClient(clientdata); // 클라이언트 갱신
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const disConnect = () => {
//     // 연결 끊기
//     if (client === null) {
//       return;
//     }
//     client.deactivate();
//   };

//   // 콜백함수 => ChatList 저장하기
//   const callback = function (message) {
//     if (message.body) {
//       let msg = JSON.parse(message.body);
//       setChatList((chats) => [...chats, msg]);
//     }
//   };

//   const sendChat = () => {
//     if (chat === "") { // 채팅이 비어있을 경우 보내지 않음
//       return;
//     }

//     client.publish({
//       destination: "/pub/chat/" + chatroomId,
//       body: JSON.stringify({
//         type: "",
//         sender: userId,
//         channelId: "1",
//         data: chat,
//       }),
//     });

//     setChat(""); // 채팅 보내기 종료
//   };

//   useEffect(() => {
//     // 최초 렌더링 시 , 웹소켓에 연결
//     // 우리는 사용자가 방에 입장하자마자 연결 시켜주어야 하기 때문에,,
//     connect();

//     return () => disConnect();
//   }, []);

//   const onChangeChat = (e) => {
//     setChat(e.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <>
//       {/* {JSON.stringify(user)} */}
//       {/* <GlobalStyle/> */}
//       <div>
//         {/* 상단 네비게이션 */}
//         <div>
//           <span>상대방 이름</span>
//         </div>

//         {/* 채팅 리스트 */}
//         <div>{msgBox}</div>

//         {/* 하단 입력폼 */}
//         <form onSubmit={handleSubmit}>
//           {/* <input type="file" accept='image/*'/>  */}
//           <div>
//             <div>
//               <input
//                 type="text"
//                 id="msg"
//                 value={chat}
//                 placeholder="메시지 보내기"
//                 onChange={onChangeChat}
//                 onKeyDown={(ev) => {
//                   console.log("ev: ", ev)
//                   if (ev.keyCode === 13) { // 13 : keyDown 이벤트
//                     sendChat();
//                   }
//                 }}
//               />
//             </div>
//           </div>
//         </form>
//       </div>
//       <p>chatroomId : {chatroomId}</p>
      
//       <div>
//         <button onClick={() => setIsProfileModal(!isProfileModal)}>프로필 이미지 임시 버튼</button>
//         {isProfileModal === true ? <FriendProfile friendId={friendId} /> : null}
//       </div>
//     </>
//   );
// }


// // import * as StompJs from "@stomp/stompjs";

// // function FriendChatting() {

// //   // 서버와 연결할 클라이언트 Connect
// //   const clientdata = new StompJs.Client({
// //     brokerURL: "ws://localhost:8080/chat",
// //     connectHeaders: {
// //       login: "",
// //       passcode: "password",
// //     },
// //     debug: function (str) {
// //       console.log(str);
// //     },
// //     reconnectDelay: 5000, // 5초마다 자동 재 연결
// //     heartbeatIncoming: 4000,
// //     heartbeatOutgoing: 4000,
// //   });

// //   // 구독 (Subscribe)
// //   clientdata.onConnect = () => {
// //     clientdata.subscribe("/sub/channels/" + chatroomId, callback);
// //   };
      
      
// //  const callback = (message) => {
// //     if (message.body) {
// //       let msg = JSON.parse(message.body);
// //       setChatList((chats) => [...chats, msg]);
// //     }
// //   };

// //   // 전송 (Publish)
// //   const sendChat = () => {
// //     if (chat === "") {
// //       return;
// //     }

// //     client.publish({
// //       destination: "/pub/chat/" + chatroomId,
// //       body: JSON.stringify({
// //         type: "",
// //         sender: userId,
// //         channelId: "1",
// //         data: chat,
// //       }),
// //     });

// //     setChat("")

// //   return (
// //     <div></div>
    
// //   )
// // }
// // }





// // export default FriendChatting
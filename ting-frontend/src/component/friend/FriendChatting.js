// Room.js 와 같은 내용
import { useLocation, useNavigate } from 'react-router-dom';
import useMessageStore from './useMessageStore';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import tokenHttp from '../../api/tokenHttp';

function FriendChatting() {
  const location = useLocation();
  const Navigate = useNavigate();
  const messageStore = useMessageStore();
  // let userdata = useSelector((state) => state.userdataReducer);

  const [previousMessage, setPreviousMessage] = useState([]);

  const {
    connected,
    messageEntered,
    messageLogs,
  } = messageStore;

  // 처음 렌더링 시 기존 데이터 DB에서 받아오기
  const getPreviousMessage = () => {
    tokenHttp.get(`/chatting/${location.state.friend.chattingId}`).then((response) => {
      // 불러오기 성공 시 previousMessage에 대화 내용 저장
      if (response.data.code === 200) {
        console.log('로그 불러오기 성공');
        console.log(response.data)
        setPreviousMessage([...response.data.data.chattingList]); // 대화 내용 저장
      }
      else if (response.data.code === 400) {
        console.log('실패');
      }
    })
    .catch(() => console.log("실패"));
  }

  // 처음 렌더링 시 실행
  useEffect(() => {
    getPreviousMessage(); // 불러온 데이터를 messageLogs에 저장
    // const messageLogs = previousMessage
    // messageLogs.push(previousMessage)
  }, [])




  const beforeUnloadListener = (() => {
    if (connected) {
      messageStore.disconnect();
    }
  });

  window.addEventListener('beforeunload', beforeUnloadListener);

  const handleSubmit = (event) => {
    event.preventDefault();
    messageStore.sendMessage({ type: 'message' });
  };

  const handleChangeInput = (event) => {
    const { value } = event.target;
    messageStore.changeInput(value);
  };

  // 채팅방 나가기
  const handleClickQuitRoom = async () => {
    messageStore.disconnect(location.state.friend.chattingId);
    console.log('채팅 연결 해제')
    // previousMessage = {};
    // messageLogs = {};
    Navigate("/friend");
  };

  if (!connected) {
    return (
      null
    );
  }

  return (
    <div>
      <h4>여기는 채팅창</h4>
      <button
        type="button"
        disabled={!connected}
        onClick={() => handleClickQuitRoom()}
      >
        연결 종료 버튼
      </button>

      <form onSubmit={handleSubmit}>
        <label htmlFor="message-to-send">
          메시지 입력
        </label>
        <input
          type="text"
          value={messageEntered}
          onChange={handleChangeInput}
        />
        <button
          type="submit"
        >
          전송
        </button>
      </form>
      <ul>
        {messageLogs.map((message) => (
          <li key={message.id}>
            {message.value}
          </li>
        ))}
      </ul>
      {/* <p>{ previousMessage.content ? previousMessage.content : 0}</p> */}
      <p>{ previousMessage.map((message) => 
        <li key={message.id}>
          {message.content}
        </li>
      ) }</p>
    </div>
  );
}

export default FriendChatting;
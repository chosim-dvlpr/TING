// Room.js 와 같은 내용
import { useLocation, useNavigate } from 'react-router-dom';
import useMessageStore from './useMessageStore';

function FriendChatting() {
  const location = useLocation();
  const Navigate = useNavigate();
  const messageStore = useMessageStore();

  const {
    connected,
    messageEntered,
    messageLogs,
  } = messageStore;

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
    </div>
  );
}

export default FriendChatting;
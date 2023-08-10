// Room.js 와 같은 내용
import { useLocation, useNavigate } from 'react-router-dom';
import useMessageStore from './useMessageStore';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import tokenHttp from '../../api/tokenHttp';
import FriendProfile from './FriendProfile';

import styles from './FriendChatting.module.css';
import { getFriendId } from '../../redux/friendStore';

function FriendChatting({ onSearch, showFriendList, showFriendChatting, setChattingObj, chattingObj }) {
  const location = useLocation();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const messageStore = useMessageStore();
  // let userdata = useSelector((state) => state.userdataReducer);

  const [previousMessage, setPreviousMessage] = useState([]);
  const [isProfileModal, setIsProfileModal] = useState(false); // 프로필 모달 띄우기

  let {
    connected,
    messageEntered,
    messageLogs,
    currentRoomIndex,

  } = messageStore;

  // 처음 렌더링 시 기존 데이터 DB에서 받아오기
  const getPreviousMessage = () => {
    tokenHttp.get(`/chatting/${chattingObj.chattingId}`).then((response) => {
    // tokenHttp.get(`/chatting/${location.state.friend.chattingId}`).then((response) => {
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
    getPreviousMessage(); // 불러온 데이터를 previousMessage에 저장
    console.log("============",chattingObj)

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
    // messageStore.disconnect(location.state.friend.chattingId);
    // messageStore.disconnect(chattingObj.chattingId);
    // messageStore.disconnect(currentRoomIndex);
    if (connected) {
      messageStore.disconnect(currentRoomIndex);
    }
    console.log('채팅 연결 해제')
    messageLogs = {};
    showFriendList(true);
    showFriendChatting(false);
    dispatch(getFriendId(null)); // 친구 프로필 닫기
    // Navigate("/friend");
  };

  // 친구 프로필 띄우기
  const showProfile = (friendId) => {
    // 프로필이 켜져있으면
    if (isProfileModal) {
      dispatch(getFriendId(null));
      setIsProfileModal(!isProfileModal); // 모달 끄기
    }
    else {
      dispatch(getFriendId(friendId));
      setIsProfileModal(!isProfileModal);
    }
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

      {/* <p>친구 닉네임 : { location.state.friend.nickname }</p> */}
      <p>친구 닉네임 : { chattingObj.nickname }</p>
      {/* <button onClick={() => setIsProfileModal(!isProfileModal)}>친구 프로필 사진 : { location.state.friend.profileImage ? location.state.friend.profileImage : '사진없음' }</button> */}
      <button onClick={() => showProfile(chattingObj.userId)}>친구 프로필 사진 : { chattingObj.profileImage ? chattingObj.profileImage : '사진없음' }</button>
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
          <p key={message.id}>
            {message.nickname} | {message.value}
          </p>
        ))}
      </ul>
      {/* <p>{ previousMessage.content ? previousMessage.content : 0}</p> */}
      <p>{ previousMessage.map((message) => 
        <p key={message.id}>
          {message.nickname} | {message.content}
        </p>
      ) }</p>

      {/* 프로필 모달 */}
      {/* {
        isProfileModal && 
        <div className={styles.chatConainer}>
        <FriendProfile userId={ chattingObj.userId }/>
      </div>
      } */}


    </div>
  );
}

export default FriendChatting;
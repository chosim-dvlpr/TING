// Room.js 와 같은 내용
import { useLocation, useNavigate } from 'react-router-dom';
import useMessageStore from './useMessageStore';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import tokenHttp from '../../api/tokenHttp';
import FriendProfile from './FriendProfile';

import styles from './FriendChatting.module.css';
import { getFriendId } from '../../redux/friendStore';
import {getCurrent, getDateTime} from "../common/TimeCalculate";

function FriendChatting({ onSearch2, showFriendList, showFriendChatting, setChattingObj, chattingObj }) {
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
      onSearch2(true);
    }
  };

  if (!connected) {
    return (
      null
    );
  }

  return (
    <div>
      <div className={styles.top}>
        <div><img src="/img/ting_logo_fish.png" alt="logo"/></div>
        <button className={styles.closeButton} type="button" disabled={!connected} onClick={() => handleClickQuitRoom()}>
          X
        </button>
      </div>
      <div className={styles.infoArea}>
        <button className={styles.imageButton} onClick={() => showProfile(chattingObj.userId)}></button>
        <div className={styles.nickname}>{chattingObj.nickname}</div> 
        <div>{chattingObj.temperature}℃</div>
        <button className={styles.kebabButton}>
          <img className={styles.kebab} src="/img/kebab.png" alt="kebab"/>
        </button>
      </div>
      {/* <p>친구 닉네임 : { location.state.friend.nickname }</p> */}
      {/* <button onClick={() => setIsProfileModal(!isProfileModal)}>친구 프로필 사진 : { location.state.friend.profileImage ? location.state.friend.profileImage : '사진없음' }</button> */}
      <div className={styles.chattingArea}>
      <table>
        { previousMessage.map((message) => 
          <tr key={message.id} className={message.nickname==chattingObj.nickname? styles.friend : styles.me}>
            <td className={message.nickname==chattingObj.nickname? styles.content2: styles.content}>{message.content}</td>
            <td className={styles.time}>{getDateTime(message.sendTime)}</td>
          </tr>
        )}
        {messageLogs.map((message) => (
          <tr key={message.id} className={message.nickname==chattingObj.nickname? styles.friend : styles.me}>
            <td className={message.nickname==chattingObj.nickname? styles.content2: styles.content}>{message.content}</td>
            <td className={styles.time}>{getCurrent(message.sendTime)}</td>
          </tr>
        ))}
      </table>
        {/* <p>{ previousMessage.content ? previousMessage.content : 0}</p> */}
      </div>
      <div className={styles.submitArea}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageEntered}
          onChange={handleChangeInput}
        />
        <button className={styles.sendButton} type="submit">
          전송
        </button>
      </form>
      </div>

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
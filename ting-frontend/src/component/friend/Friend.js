import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import styles from './Friend.module.css';
import FriendList from "./FriendList";
import FriendChatting from "./FriendChatting";
import { messageStore } from "../../redux/messageStore";

function Friend({ onSearch, onSearch2, temperature, friendUnread, curChattingObj }){
  let Navigate = useNavigate();
  let userdata = useSelector((state) => state.userdataReducer.userdata);
  let [isFriendList, setIsFriendList] = useState(true);
  let [isFriendChatting, setIsFriendChatting] = useState(false);
  let [chattingObj, setChattingObj] = useState([]);

  // 렌더링 시 유저 확인
  useEffect(() => {
    if (!userdata) {
      alert('로그인이 필요합니다.');
      Navigate("/login");
    }
  }, [])

  const closeModal = () => {
    console.log('채팅 모달 닫기');
    onSearch(false);
    // messageStore.disconnectAll();
    // Navigate((-1));
  };
  
  const showProfile = () => {
    onSearch2(true);
  }

  const showFriendList = (data) => {
    setIsFriendList(data)
  };

  const showFriendChatting = (data) => {
    setIsFriendChatting(data)
  };

  const setTemperature = (data) => {
    temperature(data);
  }

  const setFriendUnread = (data) => {
    friendUnread(data);
  }

  const setCurChattingObj = (data) => {
    curChattingObj(data);
  }

  // const closeModal = () => {
  //   setIsModalOpened(false);
  // }

  return (
    <div>
      {/* 닫기 버튼 누르면 뒤로가기로 일단 만들어놨음 */}
      {/* <button onClick={() => Navigate(-1)}>닫기버튼</button> */}
      <div onClick={(e) => e.stopPropagation()}>
        {/* <button id="modalCloseBtn" onClick={closeModal}>
          채팅 모달 닫기
        </button> */}
        {/* <FriendList /> */}
        {
          isFriendList &&
          <FriendList onSearch={closeModal} showFriendList={showFriendList} showFriendChatting={setIsFriendChatting}  setChattingObj={setChattingObj} friendUnread={setFriendUnread}/>
        }
        {
          isFriendChatting &&
          <FriendChatting onSearch2={showProfile} showFriendList={showFriendList} showFriendChatting={setIsFriendChatting} setChattingObj={setChattingObj} chattingObj={chattingObj} getTemperature={setTemperature} curChattingObj={setCurChattingObj}/>
        }    
      </div>

      {/* 돋보기 버튼 클릭 시 닉네임 검색 창 뜨도록 */}
      {/* { isSearchFriend && <input type="text" onSubmit={() => findFriend()}></input> } */}
      {/* <button onClick={() => setIsSearchFriend(!isSearchFriend)}>돋보기버튼</button> */}

      {/* <Outlet></Outlet> */}
      
    </div>
  )
}





export default Friend
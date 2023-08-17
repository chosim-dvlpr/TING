import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FriendList from "./FriendList";
import FriendChatting from "./FriendChatting";

import Swal from "sweetalert2";

function Friend({
  onSearch,
  onSearch2,
  temperature,
  friendUnread,
  curChattingObj,
}) {
  let Navigate = useNavigate();
  let userdata = useSelector((state) => state.userdataReducer.userdata);
  let [isFriendList, setIsFriendList] = useState(true);
  let [isFriendChatting, setIsFriendChatting] = useState(false);
  let [chattingObj, setChattingObj] = useState([]);

  // 렌더링 시 유저 확인
  useEffect(() => {
    if (!userdata) {
      Swal.fire({ title: "로그인이 필요합니다.", width: 400 });
      Navigate("/login");
    }
  }, []);

  const closeModal = () => {
    onSearch(false);
  };

  const showProfile = () => {
    onSearch2(true);
  };

  const showFriendList = (data) => {
    setIsFriendList(data);
  };

  const setTemperature = (data) => {
    temperature(data);
  };

  const setFriendUnread = (data) => {
    friendUnread(data);
  };

  const setCurChattingObj = (data) => {
    curChattingObj(data);
  };

  return (
    <div>
      {/* 닫기 버튼 누르면 뒤로가기로 일단 만들어놨음 */}
      <div onClick={(e) => e.stopPropagation()}>
        {isFriendList && (
          <FriendList
            onSearch={closeModal}
            showFriendList={showFriendList}
            showFriendChatting={setIsFriendChatting}
            setChattingObj={setChattingObj}
            friendUnread={setFriendUnread}
          />
        )}
        {isFriendChatting && (
          <FriendChatting
            onSearch2={showProfile}
            showFriendList={showFriendList}
            showFriendChatting={setIsFriendChatting}
            setChattingObj={setChattingObj}
            chattingObj={chattingObj}
            getTemperature={setTemperature}
            curChattingObj={setCurChattingObj}
          />
        )}
      </div>
    </div>
  );
}

export default Friend;

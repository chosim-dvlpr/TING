// Room.js 와 같은 내용
import useMessageStore from "./useMessageStore";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import tokenHttp from "../../api/tokenHttp";

import styles from "./FriendChatting.module.css";
import { getFriendId } from "../../redux/friendStore";
import { getCurrent, getDateTime } from "../common/TimeCalculate";
import basicHttp from "../../api/basicHttp";

function FriendChatting({
  onSearch2,
  showFriendList,
  showFriendChatting,
  chattingObj,
  getTemperature,
  curChattingObj,
}) {
  const dispatch = useDispatch();
  const messageStore = useMessageStore();
  const userdata = useSelector((state) => state.userdataReducer.userdata);

  const [previousMessage, setPreviousMessage] = useState([]);
  const [isProfileModal, setIsProfileModal] = useState(false); // 프로필 모달 띄우기
  const [yourSkin, setYourSkin] = useState("");

  // 채팅내용 입력시 값 검증
  const [validateInput, setValidateInput] = useState("");

  let { connected, messageEntered, messageLogs, currentRoomIndex } =
    messageStore;

  // 처음 렌더링 시 기존 데이터 DB에서 받아오기
  const getPreviousMessage = () => {
    tokenHttp
      .get(`/chatting/${chattingObj.chattingId}`)
      .then((response) => {
        // 불러오기 성공 시 previousMessage에 대화 내용 저장
        if (response.data.code === 200) {
          setPreviousMessage([...response.data.data.chattingList]); // 대화 내용 저장
          curChattingObj(chattingObj.chattingId);
        } else if (response.data.code === 400) {
          console.log("채팅 불러오기 실패");
        }
      })
      .catch(() => console.log("채팅 불러오기 실패"));
  };

  // 처음 렌더링 시 실행
  useEffect(() => {
    getPreviousMessage(); // 불러온 데이터를 previousMessage에 저장

    basicHttp
      .get(`/friend/profile/${chattingObj.userId}`)
      .then((response) => {
        const data = response.data.data;
        setYourSkin(`https://i9b107.p.ssafy.io:5157/${data.fishSkin}`);
        getTemperature(chattingObj.temperature);
      })
      .catch(() => {
        console.log("/friend/profile error");
      });
  }, []);

  const beforeUnloadListener = () => {
    if (connected) {
      messageStore.disconnect();
    }
  };

  window.addEventListener("beforeunload", beforeUnloadListener);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!messageEntered) {
      setValidateInput("메세지를 입력해주세요");
      return;
    }
    messageStore.sendMessage({ type: "message" });
  };

  const handleChangeInput = (event) => {
    setValidateInput("");
    const { value } = event.target;
    messageStore.changeInput(value);
  };

  // 채팅방 나가기
  const handleClickQuitRoom = async () => {
    curChattingObj(null);
    if (connected) {
      messageStore.disconnect(currentRoomIndex);
    }
    messageStore.connect(null, userdata.userId);
    messageLogs = {};
    showFriendList(true);
    showFriendChatting(false);
    dispatch(getFriendId(null)); // 친구 프로필 닫기
  };

  // 친구 프로필 띄우기
  const showProfile = (friendId) => {
    // 프로필이 켜져있으면
    if (isProfileModal) {
      dispatch(getFriendId(null));
      setIsProfileModal(!isProfileModal); // 모달 끄기
    } else {
      dispatch(getFriendId(friendId));
      setIsProfileModal(!isProfileModal);
      onSearch2(true);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <div>
      <div className={styles.top}>
        <img
          className={styles.logoImg}
          src="/img/ting_logo_fish.png"
          alt="logo"
        />

        <button
          className={styles.closeButton}
          type="button"
          disabled={!connected}
          onClick={() => handleClickQuitRoom()}
        >
          X
        </button>
      </div>
      <div className={styles.infoArea}>
        <button
          className={styles.imageButton}
          onClick={() => showProfile(chattingObj.userId)}
        >
          {" "}
          <img
            className={styles.fishSkinImage}
            src={yourSkin}
            alt="물고기 스킨"
          ></img>
        </button>
        <div className={styles.nickname}>{chattingObj.nickname}</div>
        <div>
          {chattingObj.temperature ? <p>{chattingObj.temperature}℃</p> : null}
        </div>
      </div>
      <div className={styles.chattingArea}>
        <table>
          {previousMessage.map((message) => (
            <tr
              key={message.id}
              className={
                message.userId == chattingObj.userId ? styles.friend : styles.me
              }
            >
              <td
                className={
                  message.userId == chattingObj.userId
                    ? styles.content2
                    : styles.content
                }
              >
                {message.content}
              </td>
              <td className={styles.time}>{getDateTime(message.sendTime)}</td>
            </tr>
          ))}
          {messageLogs.map((message) => (
            <tr
              key={message.id}
              className={
                message.userId == chattingObj.userId ? styles.friend : styles.me
              }
            >
              <td
                className={
                  message.userId == chattingObj.userId
                    ? styles.content2
                    : styles.content
                }
              >
                {message.content}
              </td>
              <td className={styles.time}>{getCurrent(message.sendTime)}</td>
            </tr>
          ))}
        </table>
      </div>
      <div className={styles.submitArea}>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.chattingInput}
            type="text"
            value={messageEntered}
            onChange={handleChangeInput}
            placeholder={validateInput}
          />
          <button className={styles.sendButton} type="submit">
            전송
          </button>
        </form>
      </div>
    </div>
  );
}

export default FriendChatting;

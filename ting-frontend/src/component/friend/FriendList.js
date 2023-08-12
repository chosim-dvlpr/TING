import { useEffect, useState } from "react";
import tokenHttp from "../../api/tokenHttp";
import FriendProfile from "./FriendProfile";
import ChatRoom from "./FriendChatting";
import { useNavigate } from "react-router-dom";
import RoomList from "./RoomList";
import Room from "./Room";

import useMessageStore from "./useMessageStore";
import { useSelector } from "react-redux";
import styles from "./FriendList.module.css";
import { getTime } from "../common/TimeCalculate";

// websocket으로 구현하기 => 실시간 데이터!

function FriendList({
  onSearch,
  showFriendList,
  showFriendChatting,
  setChattingObj,
}) {
  let [friendList, setFriendList] = useState([]);
  // let [isModal, setIsModal] = useState(true);
  // let [userId, setUserId] = useState(1); // 초기값은 ""으로 설정해두기
  let userdata = useSelector((state) => state.userdataReducer);
  let [searchFriendNickname, setSearchFriendNickname] = useState("");

  let Navigate = useNavigate();

  // 친구 찾기 버튼 클릭 시 true
  let [isSearchFriend, setIsSearchFriend] = useState(false);

  // 친구 찾기
  const searchFriend = (searchFriendNickname) => {};

  // 친구 목록 불러오기
  const friendListAxios = () => {
    tokenHttp
      .get("/friend")
      .then((response) => {
        // 불러오기 성공 시 friendList에 친구목록 저장
        if (response.data.code === 200) {
          console.log("친구 목록 불러오기 성공");
          setFriendList(response.data.data); // 친구 리스트 state에 저장
          console.log(response.data.data);

          // 각 친구 정보에서 chattingId 추출
          const friendChattingIds = response.data.data.map(
            (friend) => friend.chattingId
          );
          console.log(friendChattingIds); // 배열에 있는 친구들의 chattingId 목록

        } else if (response.data.code === 400) {
          console.log("실패");
        }
      })
      .catch(() => console.log("실패"));
  };

  // 리스트 페이지에 들어가면 친구 목록을 불러옴
  useEffect(() => {
    friendListAxios();
  }, []);

  // RoomList.js
  const messageStore = useMessageStore();

  const { connected, currentRoomIndex, roomIndices, messageLogsObject } =
    messageStore;

  // 채팅방 입장할 때
  const handleClickEnterRoom = (roomIndex) => {
    console.log("방=========", roomIndex);
    if (connected) {
      messageStore.disconnect(currentRoomIndex);
    }
    messageStore.connect(roomIndex.roomIndex);
    showFriendList(false);
    showFriendChatting(true);
    setChattingObj(roomIndex.friend);
    // console.log(roomIndex.friend)
    // Navigate("/friend/chat", { state: { friend: roomIndex.friend } })
  };

  // // 리스트 렌더링 되면 모든 채팅방 연결
  // const connectSocket = () => {
  //   if (connected) {
  //     messageStore.disconnect(currentRoomIndex);
  //   }
  //   messageStore.connect();
  // }

  // useEffect(() => {
  //   connectSocket();
  // }, [])

  // 마지막 대화 업데이트
  useEffect(() => {
    // console.log(messageLogs)
    friendListAxios();
  }, [messageLogsObject]);

  // closeModal
  const closeModal = () => {
    showFriendList(false);
    showFriendChatting(false);
    onSearch(false);
  };

  //케밥 드롭다운 클릭 시 삭제 기능

  const handleDelete = async (chattingId) => {
    try {
      const confirmDelete = window.confirm("친구를 삭제하시겠습니까?");
      if (confirmDelete) {
        await tokenHttp.delete(`/friend/${chattingId}`);
        Navigate("/")
      }
    } catch (error) {
      console.error("친구 삭제 에러:".error);
    }
  };

  return (
    <div>
      <div className={styles.top}>
        <div>
          <img src="/img/ting_logo_fish.png" alt="logo" />
        </div>
        <button className={styles.closeButton} onClick={() => closeModal()}>
          X
        </button>
      </div>
      <div className={styles.searchArea}>
        <input
          type="text"
          onChange={(e) => setSearchFriendNickname(e.target.value)}
          onSubmit={() => searchFriend(searchFriendNickname)}
        ></input>
        <button
          className={styles.searchButton}
          onClick={() => setIsSearchFriend(!isSearchFriend)}
        >
          검색
        </button>
      </div>
      {/* 친구 리스트 임시 버튼 */}
      {/* <button onClick={() => Navigate("/friend/chat")}>여기를 누르면 채팅창으로 이동</button> */}
      <div className={styles.list}>
        {/* 찾으려는 닉네임이 공백이 아닐 때 - filter */}
        {/* 입력한 값이 닉네임에 포함되어 있다면 필터링됨 */}
        {searchFriendNickname
          ? friendList
              .filter((friend) =>
                friend.nickname.includes(searchFriendNickname)
              )
              .map((friend, i) => {
                return (
                  <div key={i}>
                    <div
                      className={styles.friendItem}
                      onClick={() => {
                        handleClickEnterRoom({
                          roomIndex: friend.chattingId,
                          friend: friend,
                        });
                      }}
                    >
                      <div className={styles.image}></div>
                      <div className={styles.middle}>
                        <div className={styles.nickname}>{friend.nickname}</div>
                        <div className={styles.content}>
                          {friend.lastChattingContent}
                        </div>
                      </div>
                      <div>
                        <div className={styles.time}>
                          {getTime(friend.lastChattingTime)}
                        </div>
                        <div className={styles.unread}>
                          {messageLogsObject[friend.chattingId]
                            ? messageLogsObject[friend.chattingId].length
                            : 0}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(friend.chattingId)}>

                        <img
                          src="/img/kebab.png"
                          alt="kebab"
                          className={styles.dropdownKebab}
                        />
                      </button>
                    </div>
                  </div>
                );
              })
          : friendList.map((friend, i) => {
              return (
                <div key={i}>
                  <div
                    className={styles.friendItem}
                    onClick={() => {
                      handleClickEnterRoom({
                        roomIndex: friend.chattingId,
                        friend: friend,
                      });
                    }}
                  >
                    <div className={styles.image}></div>
                    <div className={styles.middle}>
                      <div className={styles.nickname}>{friend.nickname}</div>
                      <div className={styles.content}>
                        {friend.lastChattingContent}
                      </div>
                    </div>
                    <div>
                      <div className={styles.time}>
                        {getTime(friend.lastChattingTime)}
                      </div>
                      <div className={styles.unread}>
                        {messageLogsObject[friend.chattingId]
                          ? messageLogsObject[friend.chattingId].length
                          : 0}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(friend.chattingId)}>
                      <img
                        src="/img/kebab.png"
                        alt="kebab"
                        className={styles.dropdownKebab}
                
                      />
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
      <div>
        {/* {isModal === true ? <ChatRoom userId={userId} /> : null} */}
        {/* <RoomList /> */}
        {/* <Room /> */}
      </div>
    </div>
  );
}

export default FriendList;

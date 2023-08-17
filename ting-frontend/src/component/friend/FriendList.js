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
import { fireEvent } from "@testing-library/dom";
import Swal from "sweetalert2";

// websocket으로 구현하기 => 실시간 데이터!

function FriendList({
  onSearch,
  showFriendList,
  showFriendChatting,
  setChattingObj,
  friendUnread
}) {
  const [friendList, setFriendList] = useState([]);
  // let [isModal, setIsModal] = useState(true);
  // let [userId, setUserId] = useState(1); // 초기값은 ""으로 설정해두기
  const userdata = useSelector((state) => state.userdataReducer);
  const [searchFriendNickname, setSearchFriendNickname] = useState("");
  const [totalUnread, setTotalUnread] = useState("");
  const Navigate = useNavigate();

  // 친구 찾기 버튼 클릭 시 true
  const [isSearchFriend, setIsSearchFriend] = useState(false);

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
  const handleClickEnterRoom = (data) => {
    //friendList[i].unread + isNull(messageLogsObject[friend.chattingId])
    friendUnread(friendList[data.index].unread);
    if (connected) {
      messageStore.disconnect(currentRoomIndex);
    }
    messageStore.connect(data.roomIndex);
    showFriendList(false);
    showFriendChatting(true);
    setChattingObj(data.friend);
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
        friendListAxios();
        Navigate("/");
      }
    } catch (error) {
      console.error("친구 삭제 에러:".error);
    }
  };

  // 친구 살리기 기능
  const [showReviveConfirmation, setShowReviveConfirmation] = useState(false);

  const handleReviveConfirmation = () => {
    setShowReviveConfirmation(true);
  };

  const handleCloseReviveConfirmation = () => {
    setShowReviveConfirmation(false);
  };

  // 유저의 보유 아이템 조회
  const [userItemQuantity, setUserItemQuantity] = useState("");

  const userItemAxios = () => {
    tokenHttp.get("/item/user").then((response) => {
      if (response.data.code === 200) {
        console.log("유저 아이템 불러오기 성공");
        const items = response.data.data; // 배열 내의 객체들
        const targetItem = items.find(
          (item) => item.name === "물고기 부활 티켓"
        );
        if (targetItem) {
          setUserItemQuantity(targetItem.quantity);
        } else {
          setUserItemQuantity(0); // 해당 아이템을 찾지 못한 경우
        }
      } else if (response.data.code === 400) {
        console.log("실패");
      }
    });
  };

  useEffect(() => {
    userItemAxios();
  }, []);

  // 친구 살리기

  const reviveFriend = (chattingId) => {
    tokenHttp.put(`/item/reviveFish/${chattingId}`)
      .then((response) => {
        if (response.data.code === 200){
          Swal.fire({ title: "물고기 부활에 성공했습니다.", width: 400 });
          friendListAxios(); // 최신 친구 목록 가져오기
        } else {
          Swal.fire({ title: "물고기 부활에 실패했습니다.", width: 400 });
        }
      });
  }

  const isNull = (data) => {
    if(data) return data.length;
    else return 0;
  }

  const handleFriendDelete = async (chattingId) => {
    try {
      Swal.fire({
        title: "물고기를 삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        width: 400,
      }).then((result) => {
        if (result.isConfirmed) {
          handleDelete(chattingId);
        }
      });
    } catch (error) {
      console.error("Error alive friend:", error);
    }
  };

  const handleAlive = async (userItemQuantity, chattingId) => {
    try {
      Swal.fire({
        imageUrl: `${process.env.PUBLIC_URL}/img/item/fish_ticket.png`,
        imageWidth: 200,
        imageHeight: 200,
        title: `물고기를 살리시겠습니까?\n내 물고기 부활티켓 : ${userItemQuantity}`,
        showCancelButton: true,
        confirmButtonText: "살리기",
        cancelButtonText: "취소",
        width: 400,
      }).then((result) => {
        if (result.isConfirmed) {
          if(userItemQuantity<1) {
            try {
              Swal.fire({
                title: `티켓이 부족합니다\n구매하러 가시겠습니까?`,
                showCancelButton: true,
                confirmButtonText: "이동",
                cancelButtonText: "취소",
                width: 400,
              }).then((result) => {
                if(result.isConfirmed) {
                  Navigate(`/item/shop`);
                }
              })
            } catch (error) {
              console.error("Error alive friend:", error);
            }
          }
          else reviveFriend(chattingId);
        } else {
          handleCloseReviveConfirmation();
        }
      });
    } catch (error) {
      console.error("Error alive friend:", error);
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
        ></input>
        <button
          className={styles.searchButton}
          onClick={() => setIsSearchFriend(!isSearchFriend)}
        >
          검색
        </button>
      </div>
      <div className={styles.list}>
        {friendList.length>0? (friendList
          .filter((friend) => friend.nickname.includes(searchFriendNickname))
          .map((friend, i) => (
            <div key={i}>
              <div
                className={`${styles.friendItem} 
                ${friend.state === "ALIVE" ? styles.alive : styles.dead}`}
                onDoubleClick={() => {
                  if (friend.state === "DEAD") {
                    // handleReviveConfirmation();
                    handleAlive(userItemQuantity, friend.chattingId);
                  } else {
                    handleClickEnterRoom({
                      roomIndex: friend.chattingId,
                      index: i,
                      friend: friend
                    });
                  }
                }}
              >
                <div className={styles.image}>
              <img  src={`https://i9b107.p.ssafy.io:5157/${friend.fishSkin}`} alt="물고기 스킨"></img>
            </div>
                <div className={styles.middle}>
                  <div className={styles.nickname}>{friend.nickname}</div>
                  <div className={styles.content}>
                    {friend.lastChattingContent}
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.time}>
                    {getTime(friend.lastChattingTime)}
                  </div>
                {
                  friendList[i].unread !== 0 ?  (
                    <div className={styles.unreadArea}>
                      {friendList[i].unread + isNull(messageLogsObject[friend.chattingId]) != 0? <div className={styles.new}>N</div>: <div></div>}
                      <div className={styles.unread}>
                        {friendList[i].unread}
                      {/* {messageLogsObject[friend.chattingId]
                          ? friendList[i].unread + messageLogsObject[friend.chattingId].length
                          : friendList[i].unread}/
                          {friendList[i].unread}/
                        {messageLogsObject[friend.chattingId]? messageLogsObject[friend.chattingId].length :0} */}
                        {/* {messageLogsObject[friend.chattingId]
                          ? messageLogsObject[friend.chattingId].length
                        : 0} */}
                    </div>
                    </div> ) : ("")
                }                 
                </div>
                <div className={styles.dropdown}>
                  <button>
                    <img className={styles.kebab} src="/img/kebab.png" alt="kebab" />
                  </button>
                  <div className={styles.dropdownContent}>
                    <button onClick={() => handleFriendDelete(friend.chattingId)}>
                      친구 삭제
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
            // </div>
          )))
          : 
          (
            <div>
            친구가 없습니다.<br></br>매칭을 통해 새로운 인연을 만들어보세요!
            </div>
          )}
      </div>
    </div>
  );
}

export default FriendList;

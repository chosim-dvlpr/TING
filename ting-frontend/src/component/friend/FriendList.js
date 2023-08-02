import { useEffect, useState } from "react"
import tokenHttp from "../../api/tokenHttp";
import FriendProfile from "./FriendProfile";
import ChatRoom from "./FriendChatting";
import { useNavigate } from "react-router-dom";
import RoomList from "./RoomList";
import Room from "./Room";

import useMessageStore from "./useMessageStore";

// websocket으로 구현하기 => 실시간 데이터!

function FriendList(){
  let [friendList, setFriendList] = useState([]);
  let [isModal, setIsModal] = useState(true);
  let [userId, setUserId] = useState(1); // 초기값은 ""으로 설정해두기

  let Navigate = useNavigate();

  const friendListAxios = () => {
    tokenHttp.get('/friend').then((response) => {
      // 불러오기 성공 시 friendList에 친구목록 저장
      if (response.data.code === 200) {
        console.log('친구 목록 불러오기 성공');
        setFriendList(response.data.data);
      }
      else if (response.data.code === 400) {
        console.log('실패');
      }
    })
    .catch(() => console.log("실패"));
  };

  // 리스트 페이지에 들어가면 친구 목록을 불러옴
  useEffect(() => {
    friendListAxios();
  }, [])

  // RoomList.js
  const messageStore = useMessageStore();

  const {
    connected,
    currentRoomIndex,
    roomIndices,
  } = messageStore;

  const handleClickEnterRoom = ({ newRoomIndex }) => {
    if (connected && newRoomIndex !== currentRoomIndex) {
      messageStore.disconnect(currentRoomIndex);
    }
    messageStore.connect(newRoomIndex);
  };
  

  const handleClickQuitRoom = async () => {
    messageStore.disconnect(currentRoomIndex);
  };

  return (
    <div>
      <h3>여기는 친구리스트</h3>
      {/* 친구 리스트 임시 버튼 */}
      <button onClick={() => Navigate("/friend/chat")}>여기를 누르면 채팅창으로 이동</button>
      <div>
        {
          friendList.map((friend, i) => {
            return ( 
              <div key={i}>
                {/* profileImage 추가 필요 */}
                {/* 프로필이미지 클릭 시 userId에 저장 */}
                {/* <img></img> */}
                <h3>{ friend.nickname }</h3>
                <h4>{ friend.lastChattingContent }</h4>
                <h4>{ friend.unreaded }</h4>
                <button>케밥</button>
                <button
                  type="button"
                  disabled={i === currentRoomIndex}
                  onClick={() => {handleClickEnterRoom({
                    previousRoomIndex: currentRoomIndex,
                    newRoomIndex: i,
                  });
                  Navigate("/friend/chat");
                }}
                >
                  채팅방
                  {' '}
                  {i}
                </button>
                <button
                  type="button"
                  disabled={!connected}
                  onClick={() => handleClickQuitRoom()}
                >
                  연결 종료
                </button>
              </div>
            )
          })
        }

      </div>

      <div>
        {/* {isModal === true ? <ChatRoom userId={userId} /> : null} */}
        <RoomList />
        <Room />
      </div>
    </div>
  )
}





export default FriendList
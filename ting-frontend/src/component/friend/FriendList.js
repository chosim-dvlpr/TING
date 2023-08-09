import { useEffect, useState } from "react"
import tokenHttp from "../../api/tokenHttp";
import FriendProfile from "./FriendProfile";
import ChatRoom from "./FriendChatting";
import { useNavigate } from "react-router-dom";
import RoomList from "./RoomList";
import Room from "./Room";

import useMessageStore from "./useMessageStore";
import { useSelector } from "react-redux";

// websocket으로 구현하기 => 실시간 데이터!

function FriendList({ onSearch, showFriendList, showFriendChatting, setChattingObj }){
  let [friendList, setFriendList] = useState([]);
  // let [isModal, setIsModal] = useState(true);
  // let [userId, setUserId] = useState(1); // 초기값은 ""으로 설정해두기
  let userdata = useSelector((state) => state.userdataReducer);
  let [searchFriendNickname, setSearchFriendNickname] = useState("");

  let Navigate = useNavigate();

  // 친구 찾기 버튼 클릭 시 true
  let [isSearchFriend, setIsSearchFriend] = useState(false);

  // 친구 찾기
  const searchFriend = (searchFriendNickname) => {

  };

  // 친구 목록 불러오기
  const friendListAxios = () => {
    tokenHttp.get('/friend').then((response) => {
      // 불러오기 성공 시 friendList에 친구목록 저장
      if (response.data.code === 200) {
        console.log('친구 목록 불러오기 성공');
        setFriendList(response.data.data); // 친구 리스트 state에 저장
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
    messageLogsObject,
  } = messageStore;

  // 채팅방 입장할 때
  const handleClickEnterRoom = (roomIndex) => {
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

  // 리스트 렌더링 되면 모든 채팅방 연결
  const connectSocket = () => {
    // if (connected) {
    //   messageStore.disconnect(currentRoomIndex);
    // }
    messageStore.connect();
  }

  // useEffect(() => {
  //   connectSocket();
  // }, [])

  // closeModal
  const closeModal = () => {
    showFriendList(false) ;
    showFriendChatting(false);
    onSearch(false);
  };

  return (
    <div>
      <h3>여기는 친구리스트</h3>
      <button onClick={() => closeModal()}>close Modal</button>
      {/* <button onClick={() => Navigate("/")}>친구 목록 닫기</button> */}
      {/* 돋보기 버튼 클릭 시 닉네임 검색 창 뜨도록 */}
      { isSearchFriend &&
      <input type="text" 
      onChange={(e) => setSearchFriendNickname(e.target.value)} 
      onSubmit={() => searchFriend(searchFriendNickname)}>
      </input> }
      <button onClick={() => setIsSearchFriend(!isSearchFriend)}>돋보기버튼</button>
      {/* 친구 리스트 임시 버튼 */}
      {/* <button onClick={() => Navigate("/friend/chat")}>여기를 누르면 채팅창으로 이동</button> */}
      <div>
        {/* 찾으려는 닉네임이 공백이 아닐 때 - filter */}
        {/* 입력한 값이 닉네임에 포함되어 있다면 필터링됨 */}
        { searchFriendNickname ? 
        friendList
        .filter((friend) => friend.nickname.includes(searchFriendNickname))
        .map((friend, i) => {
            return ( 
              <div key={i}>
                <div onClick={() => {handleClickEnterRoom({
                  roomIndex: friend.chattingId,
                  friend: friend,
                  })
                }}>
                {/* profileImage 추가 필요 */}
                {/* 프로필이미지 클릭 시 userId에 저장 */}
                {/* <img></img> */}
                <h2>여기를 클릭하면 채팅창으로 이동!</h2>
                <h3>친구 닉네임 : { friend.nickname }</h3>
                <h4>친구 프로필 : { friend.profileImage }</h4>
                <h4>친구 마지막 대화 : { friend.lastChattingContent }</h4>
                <h4>친구 안읽은 개수 : { messageLogsObject[friend.chattingId]? messageLogsObject[friend.chattingId].length : 0 }</h4>
                <h4>친구 아이디 번호 : { friend.userId }</h4>
                <h4>채팅방 번호 : { friend.chattingId }</h4>
                <h4>친구 상태 : { friend.state }</h4>
                </div>
                <button>케밥 버튼입니당</button>
                <br/>
              </div>
            )
          })
        :
          friendList.map((friend, i) => {
            return ( 
              <div key={i}>
                <div onClick={() => {handleClickEnterRoom({
                  roomIndex: friend.chattingId,
                  friend: friend,
                  })
                }}>
                {/* profileImage 추가 필요 */}
                {/* 프로필이미지 클릭 시 userId에 저장 */}
                {/* <img></img> */}
                <h2>여기를 클릭하면 채팅창으로 이동!</h2>
                <h3>친구 닉네임 : { friend.nickname }</h3>
                <h4>친구 프로필 : { friend.profileImage }</h4>
                <h4>친구 마지막 대화 : { friend.lastChattingContent }</h4>
                <h4>친구 안읽은 개수 : { messageLogsObject[friend.chattingId]? messageLogsObject[friend.chattingId].length : 0 }</h4>
                <h4>친구 아이디 번호 : { friend.userId }</h4>
                <h4>채팅방 번호 : { friend.chattingId }</h4>
                <h4>친구 상태 : { friend.state }</h4>
                </div>
                <button>케밥 버튼입니당</button>
                <br/>
              </div>
            )
          })
        }

      </div>

      <div>
        {/* {isModal === true ? <ChatRoom userId={userId} /> : null} */}
        {/* <RoomList /> */}
        {/* <Room /> */}
      </div>
    </div>
  )
}





export default FriendList
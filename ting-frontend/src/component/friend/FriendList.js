import { useEffect, useState } from "react"
import tokenHttp from "../../api/tokenHttp";
import FriendProfile from "./FriendProfile";
import ChatRoom from "./FriendChatting";

// websocket으로 구현하기 => 실시간 데이터!

function FriendList(){
  let [friendList, setFriendList] = useState([]);
  let [isModal, setIsModal] = useState(true);
  let [userId, setUserId] = useState(1); // 초기값은 ""으로 설정해두기

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

  return (
    <div>
      <h3>여기는 친구리스트</h3>
      <h3 onClick={() => setIsModal(!isModal)}>리스트 임시</h3>
      <div>
        {
          friendList.map((friend, i) => {
            return ( 
              <div>
                {/* profileImage 추가 필요 */}
                {/* 프로필이미지 클릭 시 userId에 저장 */}
                {/* <img></img> */}
                <h3>{ friend.nickname }</h3>
                <h4>{ friend.lastChattingContent }</h4>
                <h4>{ friend.unreaded }</h4>
                <button>케밥</button>
              </div>
            )
          })
        }

      </div>

      <div>
        {isModal === true ? <ChatRoom userId={userId} /> : null}
      </div>
    </div>
  )
}





export default FriendList
import { useEffect, useState } from "react"
import basicHttp from "../../api/basicHttp";

function FriendProfile(props){
  let [friendProfile, setFriendProfile] = useState([]);
  
  const friendProfileAxios = () => {
    basicHttp.get(`/friend/profile/${props.userId}`).then((response) => {
      // 불러오기 성공 시 friendList에 친구목록 저장
      if (response.data.code === 200) {
        console.log('프로필 불러오기 성공');
        setFriendProfile(response.data.data);
      }
      else if (response.data.code === 400) {
        console.log('프로필 불러오기 실패');
      }
    })
    .catch(() => console.log("실패"));
    
  }

  useEffect(() => {
    friendProfileAxios();
  }, [])


  return (
    <div>
      <h3>프로필</h3>

      {/* 프로필 이미지 추가 필요 */}
      <p>{ friendProfile.nickname }</p>
      <p>{ friendProfile.introduce }</p>
      <p>{ friendProfile.height }</p>
      <p>{ friendProfile.mbtiCode }</p>
      <p>{ friendProfile.drinkingCode }</p>
      <p>{ friendProfile.religionCode }</p>
      <p>{ friendProfile.jobCode }</p>
      <p>{ friendProfile.userHobbys }</p>
      <p>{ friendProfile.userStyles }</p>
      <p>{ friendProfile.userPersonalities }</p>
      {/* 온도 추가 필요 */}
    </div>
  )
}





export default FriendProfile
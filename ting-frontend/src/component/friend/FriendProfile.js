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
      <p>닉네임 : { friendProfile.nickname }</p>
      <p>자기소개 : { friendProfile.introduce }</p>
      <p>#{ friendProfile.region }</p>
      <p>#{ friendProfile.height }</p>
      <p>#{ friendProfile.mbtiCode && friendProfile.mbtiCode.name }</p>
      <p>#{ friendProfile.drinkingCode && friendProfile.drinkingCode.name }</p>
      <p>#{ friendProfile.religionCode && friendProfile.religionCode.name }</p>
      <p>#{ friendProfile.jobCode && friendProfile.jobCode.name }</p>
      <p>#{ friendProfile.userHobbys &&
        friendProfile.userHobbys.map((hobby, i) => (
        hobby.name
      )) }</p>
      <p>#{ friendProfile.userStyles && 
        friendProfile.userStyles.map((style, i) => (
        style.name
      )) }</p>
      <p>#{ friendProfile.userPersonalities && 
        friendProfile.userPersonalities.map((personality, i) => (
        personality.name
      )) }</p>
      {/* 온도 추가 필요 */}
      <hr/>
    </div>
  )
}





export default FriendProfile
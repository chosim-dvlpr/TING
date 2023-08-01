import { useEffect } from "react"
import basicHttp from "../../api/basicHttp";

function FriendProfile(props){
  
  const friendProfileAxios = () => {
    basicHttp.get(`/friend/profile/${props.userId}`).then((response) => {
      // 불러오기 성공 시 friendList에 친구목록 저장
      if (response.data.code === 200) {
        console.log('프로필 불러오기 성공');
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

    </div>
  )
}





export default FriendProfile
import { useSelector } from "react-redux";

function ProfileHeader() {
  let userdata = useSelector((state) => state.userdataReducer.userdata);

  return (
    <div>
      <h1>프로필 헤더</h1>
      
      <p>프로필 이미지</p>

      <p>이름 : { userdata.name }</p>
      <p>자기소개 : { userdata.introduce }</p>
    </div>
  )
}

export default ProfileHeader
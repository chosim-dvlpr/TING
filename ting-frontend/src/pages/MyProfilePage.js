import { Outlet } from "react-router-dom"
import ProfileHeader from "../component/profile/common/ProfileHeader"
import ProfileSideBar from "../component/profile/common/ProfileSideBar"
import NavBar from "../component/common/NavBar"
import { useState } from "react";
import Friend from "../component/friend/Friend";

function MyProfilePage(){
  const [isModalOpened, setIsModalOpened] = useState(false);

  return(
    <div>
      <NavBar/>
      <h1>여기는 프로필 페이지</h1>
      
      <hr />
      <button onClick={() => setIsModalOpened(true)}>채팅 목록 버튼</button>
      {
        isModalOpened &&
        <Friend onSearch={setIsModalOpened} />
      }
      <hr />

      <ProfileHeader />
      <ProfileSideBar />
      <Outlet></Outlet>
    </div>

  )
}

export default MyProfilePage
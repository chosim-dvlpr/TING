import { Outlet } from "react-router-dom"
import ProfileHeader from "../component/profile/common/ProfileHeader"
import ProfileSideBar from "../component/profile/common/ProfileSideBar"

function MyProfilePage(){

  return(
    <div>
      <h1>여기는 프로필 페이지</h1>

      <ProfileHeader />
      <ProfileSideBar />
      <Outlet></Outlet>
    </div>

  )
}

export default MyProfilePage
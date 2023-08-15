import { useEffect } from "react";
import tokenHttp from "../api/tokenHttp";

import { Outlet } from "react-router-dom";
import ProfileHeader from "../component/profile/common/ProfileHeader";
import ProfileSideBar from "../component/profile/common/ProfileSideBar";
import NavBar from "../component/common/NavBar";
import FriendButton from "../component/common/FriendButton";

import { useState } from "react";
import Friend from "../component/friend/Friend";

import styles from "./MyProfilePage.module.css";

import { useDispatch } from "react-redux";
import { getCurrentUserdata } from "../redux/userdata";
import { useSelector } from "react-redux";

function MyProfilePage() {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);

  let dispatch = useDispatch();

  // useEffect(() => {
  //   // 유저 데이터 redux에 저장
  //   tokenHttp.get("/user").then((response) => {
  //     dispatch(getCurrentUserdata(response.data.data));
  //     localStorage.setItem("userId", response.data.data.userId);
  //   });
  // }, []);

  return (
    <div className={styles.outer}>
      <NavBar />
      {userdata && (
        <FriendButton
          toggleWheelHandler={() => setWheelHandlerActive((active) => !active)}
        />
      )}
      {/* <button onClick={() => setIsModalOpened(true)}>채팅 목록 버튼</button>
      {
        isModalOpened &&
        <Friend onSearch={setIsModalOpened} />
      }
      <hr /> */}
      <div className={styles.container}>
        <ProfileHeader />
        <div className={styles.innerContainer}>
          <ProfileSideBar />
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;

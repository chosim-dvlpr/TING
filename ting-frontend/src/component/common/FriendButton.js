import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

import styles from "./FriendButton.module.css";
import Friend from "../friend/Friend";

import { Link, useNavigate } from "react-router-dom";
import FriendProfile from "../friend/FriendProfile";

const FriendButton = () => {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const navigate = useNavigate();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [show, setShow] = useState(false);
  // const [showProfile, setShowProfile] = useState(false);
  const userId = useSelector((state) => state.friendReducer.friendId);
  
  // let isClosed = true;

  const changeIsClosed = () => {
    // alert(isClosed);
    // isClosed = !isClosed;
    // console.log(isClosed);
    if(show) setShow(false);
    else setShow(true);
  };

  const closeModal = (data) => {
    setIsModalOpened(data);
    changeIsClosed();
  };

  return (
    <div className={styles.friendContainer}>
      <div>
        {/* <div className={styles.profileContainer}></div> */}
        {show && <div className={styles.chatContainer}>
          <Friend onSearch={closeModal} />
      </div>}
      <div>
        {userId && <div className={styles.profileContainer}>
          <FriendProfile userId={userId} />
        </div>}
      </div>
      {/* <div className={isClosed? styles.hide : styles.chatConainer}>
        <Friend />
      </div> */}
      </div>
      <button className={styles.button} onClick={() => changeIsClosed()}>어항</button>
    </div>
  );
};

export default FriendButton;

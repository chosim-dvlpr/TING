import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

import styles from "./FriendButton.module.css";
import Friend from "../friend/Friend";

import { Link, useNavigate } from "react-router-dom";

const FriendButton = () => {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const navigate = useNavigate();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [show, setShow] = useState(false);

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
      {/* <div className={styles.profileContainer}></div> */}
      {show && <div className={styles.chatConainer}>
        <Friend onSearch={closeModal} />
      </div>}
      {/* <div className={isClosed? styles.hide : styles.chatConainer}>
        <Friend />
      </div> */}
      <button className={styles.button} onClick={() => changeIsClosed()}>어항</button>
    </div>
  );
};

export default FriendButton;

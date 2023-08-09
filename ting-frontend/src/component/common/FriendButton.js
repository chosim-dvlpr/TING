import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

import styles from "./FriendButton.module.css";

import { Link, useNavigate } from "react-router-dom";

const FriendButton = () => {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const navigate = useNavigate();

  let isClosed = true;

  const changeIsClosed = () => {
    alert("===");
    isClosed = !isClosed;
    console.log(isClosed);
  }

  return (
    <div className={styles.friendContainer}>
      <div className={styles.profileContainer}></div>
      <div className={isClosed? styles.hide : styles.chatConainer}></div>
      <button className={styles.button} onClick={() => changeIsClosed()}>어항</button>
    </div>
  );
};

export default FriendButton;

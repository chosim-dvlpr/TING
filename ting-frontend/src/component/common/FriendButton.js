import { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

import styles from "./FriendButton.module.css";
import Friend from "../friend/Friend";

import { Link, useNavigate } from "react-router-dom";
import FriendProfile from "../friend/FriendProfile";

import MyContext from "../../MyContext";

const FriendButton = () => {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const navigate = useNavigate();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [show, setShow] = useState(false);
  const [profileShow, setProfileShow] = useState(false);
  const [icon, setIcon] = useState("");
  const [temperature, setTemperature] = useState("");
  // const [showProfile, setShowProfile] = useState(false);
  const userId = useSelector((state) => state.friendReducer.friendId);

  // let isClosed = true;

  const mainPageHandler = useContext(MyContext).wheelHandler; // useContext 훅 사용
  const scrollStyle = useContext(MyContext).scrollStyle;
  const noScrollStyle = useContext(MyContext).noScrollStyle;

  const changeIsClosed = () => {
    // alert(isClosed);
    // isClosed = !isClosed;
    // console.log(isClosed);
    if (show) {
      setShow(false);
      setProfileShow(false);
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo({
        left: 0,
        top: parseInt(scrollY || "0", 10) * -1,
        behavior: "instant",
      });

      window.addEventListener("wheel", mainPageHandler);
      window.addEventListener("DOMMouseScroll", mainPageHandler);
      window.addEventListener("mousewheel", mainPageHandler);
      scrollStyle();
    } else {
      setShow(true);
      document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow: scroll;
      width: 100%;`;

      window.removeEventListener("wheel", mainPageHandler);
      window.removeEventListener("DOMMouseScroll", mainPageHandler);
      window.removeEventListener("mousewheel", mainPageHandler);
      noScrollStyle();
    }
  };

  const closeModal = (data) => {
    setIsModalOpened(data);
    changeIsClosed();
  };

  const openProfile = (data) => {
    setProfileShow(data);
  };

  const getIcon = () => {
    tokenHttp
      .get("/user/skin")
      .then((response) => {
        if (response.data.code == 200) {
          console.log(response.data.data);
          console.log(response.data.data.itemType);
          setIcon(getName(response.data.data.itemType));
          console.log(icon);
        } else {
          console.log("아이콘 불러오기 실패");
        }
      })
      .catch(() => {
        console.log("아이콘 불러오기 실패");
      });
  };

  const getName = (category) => {
    if (category == "SKIN_3") return "bowl";
    else if (category == "SKIN_5") return "tank";
    else if (category == "SKIN_10") return "aquarium";
    else return "glass";
  };

  const getTemperature = (data) => {
    setTemperature(data);
  }

  useEffect(() => {
    getIcon();
  }, [icon]);

  return (
    <div className={styles.friendContainer}>
      <button className={styles.button} onClick={() => changeIsClosed()}>
        <img
          src={process.env.PUBLIC_URL + `/img/friend_${icon}.png`}
          className={styles.coinImage}
          alt="icon"
        />
      </button>
      <div>
        {/* <div className={styles.profileContainer}></div> */}
        {show && (
          <div className={styles.chatContainer}>
            <Friend onSearch={closeModal} onSearch2={openProfile} temperature={getTemperature} />
          </div>
        )}
        <div>
          {profileShow && userId && (
            <div className={styles.profileContainer}>
              <FriendProfile userId={userId} temperature={temperature} />
            </div>
          )}
        </div>
        {/* <div className={isClosed? styles.hide : styles.chatConainer}>
        <Friend />
      </div> */}
      </div>
    </div>
  );
};

export default FriendButton;

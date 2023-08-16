import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

import styles from "./NavBar.module.css";
import Dropdown from "react-bootstrap/Dropdown";

import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/userdata";
import useMessageStore from "../friend/useMessageStore";

const NavBar = () => {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let [dropdown, setDropdown] = useState(false);
  const messageStore = useMessageStore();

  // drop down 토글 동작 로직
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userData]);

  // 로그아웃 버튼 클릭시 동작
  const handleLogout = () => {
    localStorage.removeItem("access-token"); // localStorage의 access-token 삭제
    localStorage.removeItem("refresh-token"); // localStorage의 refresh-token 삭제
    dispatch(logout()); // redux의 user 정보 삭제
    messageStore.disconnect();
    setDropdown(false);
    navigate("/"); // 로그아웃시 메인으로 이동
  };

  const handleMypage = () => {
    // 유저 데이터 redux에 저장
    tokenHttp.get("/user").then((response) => {
      dispatch(getCurrentUserdata(response.data.data));
      localStorage.setItem("userId", response.data.data.userId);
    });

    navigate("/mypage");
    setDropdown(false);
  };

  return (
    <div className={styles.mainNav}>
      <div className={styles.navLeft}>
        <Link className={styles.navMenu} to="/">
          <img
            src={process.env.PUBLIC_URL + "/img/ting_logo_fish.png"}
            className={styles.logo}
            alt="logo"
          ></img>
          {/* <span>TING</span> */}
        </Link>
        <Link className={styles.navMenu} to="/tutorial">
          <img
            src={process.env.PUBLIC_URL + "/img/해마.png"}
            className={styles.menuItem}
          ></img>
          <div className={styles.menuName}>튜토리얼</div>
        </Link>
        <Link className={styles.navMenu} to="/community">
          <img
            src={process.env.PUBLIC_URL + "/img/불가사리.png"}
            className={styles.menuItem}
          ></img>
          <div className={styles.menuName}>커뮤니티</div>
        </Link>
        {userData ? (
          <Link className={styles.navMenu} to="/item/shop">
            <img
              src={process.env.PUBLIC_URL + "/img/해초2.png"}
              className={styles.menuItem}
            ></img>
            <div className={styles.menuName}>아이템샵</div>
          </Link>
        ) : null}
        {userData ? (
          <Link className={styles.navMenu} to="/matching">
            <img
              id={styles.tingBtn}
              src={process.env.PUBLIC_URL + "/img/air-balloon.png"}
              className={styles.menuItem}
            ></img>
            {/* <div className={styles.menuName}>매칭</div> */}
          </Link>
        ) : null}
      </div>
      <div className={styles.navRight}>
        {
          userData ? (
            <div ref={dropdownRef} className={styles.yesLoginedDiv}>
              {/* userData에서 프로필 이미지 받아서 표시 */}
              {/* TODO: 프로필 이미지 클릭시 드롭다운 메뉴 */}
              {dropdown ? (
                <div className={styles.dropDownMenu}>
                  <div onClick={handleMypage}>마이페이지</div>
                  <div onClick={handleLogout}>로그아웃</div>
                </div>
              ) : null}
              <div className={styles.profileImageDiv}>
                <img
                  src={`https://i9b107.p.ssafy.io:5157/${userData.fishSkin}`}
                  onClick={() => setDropdown(!dropdown)}
                  className={styles.profileImage}
                  alt="profile"
                />
              </div>
              <div>
                <span className={styles.nickname}>{userData.nickname}</span>님
              </div>
            </div>
          ) : (
            <>
              <div
                id={styles.login}
                className={styles.loginDiv}
                onClick={() => navigate("/login")}
              >
                로그인
              </div>
            </>
          )
          // null
        }
      </div>
    </div>
  );
};

export default NavBar;

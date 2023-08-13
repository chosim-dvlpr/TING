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
  }, []);

  // 로그아웃 버튼 클릭시 동작
  const handleLogout = () => {
    localStorage.removeItem("access-token"); // localStorage의 access-token 삭제
    localStorage.removeItem("refresh-token"); // localStorage의 refresh-token 삭제
    dispatch(logout()); // redux의 user 정보 삭제
    messageStore.disconnect();
    setDropdown(false);
    navigate("/"); // 로그인 완료되면 메인으로 이동
  };

  const handleMypage = () => {
    // 유저 데이터 redux에 저장
    tokenHttp.get("/user").then((response) => {
      dispatch(getCurrentUserdata(response.data.data));
      localStorage.setItem("userId", response.data.data.userId);
    });

    navigate("/mypage"); 
    setDropdown(false)
  }

  const openClam = e => {
    e.target.src = process.env.PUBLIC_URL + '/img/조개.png';
  }
  const closeClam = e => {
    e.target.src = process.env.PUBLIC_URL + '/img/조개2.png';
  }

  return (
    <div className={styles.mainNav}>
      <div className={styles.navLeft}>
        <Link className={styles.navMenu} to="/">
          <img src={process.env.PUBLIC_URL + '/img/ting_logo_fish.png'} className={styles.logo} alt="logo"></img>
          {/* <span>TING</span> */}
        </Link>
        <Link className={styles.navMenu} to="/tutorial">
          <img 
            onMouseOver={openClam} 
            onMouseLeave={closeClam} 
            src={process.env.PUBLIC_URL + '/img/조개2.png'} 
            className={styles.menuItem}></img>
          <div className={styles.menuName}>튜토리얼</div>
        </Link>
        <Link className={styles.navMenu} to="/community">
          <img 
            onMouseOver={openClam} 
            onMouseLeave={closeClam} 
            src={process.env.PUBLIC_URL + '/img/조개2.png'} 
            className={styles.menuItem}></img>
          <div className={styles.menuName}>커뮤니티</div>
        </Link>
      </div>
      <div className={styles.navRight}>
        {userData ? (
          <div ref={dropdownRef}>
            {/* userData에서 프로필 이미지 받아서 표시 */}
            {/* TODO: 프로필 이미지 클릭시 드롭다운 메뉴 */}
            <img
              // src={`https://i9b107.p.ssafy.io:5157/user/profile/${userData.userId}`}
              src={process.env.PUBLIC_URL + '/img/조개.png'}
              onClick={() => setDropdown(!dropdown)}
              className={styles.profileImage}
              alt="profile"
            />
            <div><span className={styles.nickname}>{userData.nickname}</span>님</div>
            {dropdown ? (
              <Dropdown.Menu show>
                <Dropdown.Item eventKey="1" onClick={handleMypage}>Mypage</Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={() => {navigate("/item/shop"); setDropdown(false)}}>아이템샵</Dropdown.Item>
                <Dropdown.Item eventKey="3" onClick={handleLogout}>로그아웃</Dropdown.Item>
              </Dropdown.Menu>
            ) : null}
          </div>
        ) : (
          <>
            <span className={styles.navMenu} onClick={() => navigate("/login")}>
              <img src={process.env.PUBLIC_URL + '/img/조개2.png'} onMouseOver={openClam} onMouseLeave={closeClam} className={styles.menuItem}></img>
              <div className={styles.menuName}>로그인</div>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;

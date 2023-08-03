import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./NavBar.module.css";
import Dropdown from "react-bootstrap/Dropdown";

import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/userdata";

const NavBar = () => {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let [dropdown, setDropdown] = useState(false);

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
    setDropdown(false);
  };

  return (
    <div className={styles.mainNav}>
      <div className={styles.navLeft}>
        <img src="img/pixelting.png" className="logo" alt="logo"></img>
        <Link className={styles.navMenu} to="/">
          메인
        </Link>
        <Link className={styles.navMenu} to="/tutorial">
          튜토리얼
        </Link>
        <Link className={styles.navMenu} to="/community">
          커뮤니티
        </Link>
      </div>
      <div className={styles.navRight}>
        {userData ? (
          <div ref={dropdownRef}>
            {/* userData에서 프로필 이미지 받아서 표시 */}
            {/* TODO: 프로필 이미지 클릭시 드롭다운 메뉴 */}
            <img
              src={`https://i9b107.p.ssafy.io:5157/user/profile/${userData.userId}`}
              onClick={() => setDropdown(!dropdown)}
              className={styles.profileImage}
              alt="profile"
            />
            <span><span className={styles.nickname}>{userData.nickname}</span>님</span>
            {dropdown ? (
              <Dropdown.Menu show>
                <Dropdown.Item eventKey="1" onClick={() => {navigate("/mypage"); setDropdown(false)}}>마이페이지</Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={handleLogout}>로그아웃</Dropdown.Item>
              </Dropdown.Menu>
            ) : null}
          </div>
        ) : (
          <>
            <span className={styles.navMenu} onClick={() => navigate("/login")}>
              로그인
            </span>
            <span className={styles.navMenu} onClick={() => navigate("/signup")}>
              회원가입
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;

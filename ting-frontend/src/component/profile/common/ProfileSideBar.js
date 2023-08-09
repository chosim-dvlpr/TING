import { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ProfileSideBar.module.css"

function ProfileSideBar() {
  let Navigation = useNavigate();

  const myPageMenuRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/mypage':
      case '/mypage/update':
        modifySelectedClass(0);
        break;
      case '/mypage/passwordupdate':
        modifySelectedClass(1);
        break;
      case '/mypage/qna':
      case '/mypage/qnacreate':
      case '/mypage/qnadetail':
        modifySelectedClass(2);
        break;
      case '/mypage/myarticle':
        modifySelectedClass(3);
        break;
      case '/mypage/deleteaccount':
        modifySelectedClass(4);
        break;
    }
  });

  const handleMyProfile = (e) => {
    Navigation("/mypage");
  }

  const handlePasswordUpdate = (e) => {
    Navigation("/mypage/passwordupdate");
  }

  const handleQna = (e) => {
    Navigation("/mypage/qna");
  }

  const handleMyArticle = (e) => {
    Navigation("/mypage/myarticle");
  }

  const handleDeleteAccount = (e) => {
    Navigation("/mypage/deleteaccount");
  }

  const modifySelectedClass = (num) => {
    myPageMenuRef.current.map((ref, i) => {
      if (i == num) ref.className = styles.yesSelected;
      else ref.className = styles.noSelected;
    })
  }

  return (
    <div className={styles.wrapper}>
      <div
        ref={el => (myPageMenuRef.current[0] = el)}
        className={styles.noSelected}
        onClick={handleMyProfile}>
        내 프로필
      </div>
      <div
        ref={el => (myPageMenuRef.current[1] = el)}
        className={styles.noSelected}
        onClick={handlePasswordUpdate}>
        비밀번호 변경
      </div>
      <div
        ref={el => (myPageMenuRef.current[2] = el)}
        className={styles.noSelected}
        onClick={handleQna}>
        문의하기
      </div>
      <div
        ref={el => (myPageMenuRef.current[3] = el)}
        className={styles.noSelected}
        onClick={handleMyArticle}>
        작성 게시글 조회
      </div>
      <div
        ref={el => (myPageMenuRef.current[4] = el)}
        className={styles.noSelected}
        onClick={handleDeleteAccount}>
        회원 탈퇴
      </div>
    </div>
  )
}

export default ProfileSideBar
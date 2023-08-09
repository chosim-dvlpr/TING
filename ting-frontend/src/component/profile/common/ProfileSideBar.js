import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileSideBar.module.css"

function ProfileSideBar() {
  let Navigation = useNavigate();

  const myPageMenuRef = useRef([]);

  const handleMyProfile = (e) => {
    modifySelectedClass(e);
    Navigation("/mypage");
  }
  
  const handlePasswordUpdate = (e) => {
    modifySelectedClass(e);
    Navigation("/mypage/passwordupdate");
  }

  const handleQna = (e) => {
    modifySelectedClass(e);
    Navigation("/mypage/qna");
  }
  
  const handleMyArticle = (e) => {
    modifySelectedClass(e);
    Navigation("/mypage/myarticle");
  }
    
  const handleDeleteAccount = (e) => {
    modifySelectedClass(e);
    Navigation("/mypage/deleteaccount");
  }

  const modifySelectedClass = (e) => {
    for(let i = 0; i < myPageMenuRef.current.length; i++) {
      if(myPageMenuRef.current[i] === e.target){
        myPageMenuRef.current[i].className = styles.yesSelected;
      } else {
        myPageMenuRef.current[i].className = styles.noSelected;
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        ref={el => (myPageMenuRef.current[0] = el)} 
        className={styles.yesSelected} 
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
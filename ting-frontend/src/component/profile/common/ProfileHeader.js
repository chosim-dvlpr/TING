import { useSelector } from "react-redux";

import styles from "./ProfileHeader.module.css";

function ProfileHeader() {
  let userData = useSelector((state) => state.userdataReducer.userdata);

  const editProfileImg = () => {
    console.log("이 부분에서 프로필 이미지 업로드 호출해야 함");
    console.log(userData);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>
        {userData.profileImage ? (
          <img
            id={styles.profileImg}
            src={`https://i9b107.p.ssafy.io:5157/user/profile/${userData.userId}`}
          />
        ) : (
          <div id={styles.noImg}>
            프로필 이미지를<br></br>등록해보세요!
          </div>
        )}
        <img
          id={styles.editImg}
          src={process.env.PUBLIC_URL + "/img/pencil_icon.png"}
          onClick={editProfileImg}
        />
      </div>

      <div className={styles.innerWrapper}>
        <h3 className={styles.nickname}>{userData.nickname}</h3>
        <p className={styles.introduce}>
          {userData.introduce ? userData.introduce : "자기소개를 작성해보세요!"}
        </p>
      </div>
    </div>
  );
}

export default ProfileHeader;

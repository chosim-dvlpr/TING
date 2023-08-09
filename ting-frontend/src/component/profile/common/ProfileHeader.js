import { useSelector } from "react-redux";

import styles from './ProfileHeader.module.css';

function ProfileHeader() {
  let userData = useSelector((state) => state.userdataReducer.userdata);

  const editProfileImg = () => {
    console.log('이 부분에서 프로필 이미지 업로드 호출해야 함');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>
        <img id={styles.profileImg} src={`https://i9b107.p.ssafy.io:5157/user/profile/${userData.userId}`} />
        <img
          id={styles.editImg}
          src={process.env.PUBLIC_URL + '/img/pencil_icon.png'}
          onClick={editProfileImg} />
      </div>

      <div className={styles.innerWrapper}>
        <h3 className={styles.nickname}>{userData.nickname}</h3>
        <p className={styles.introduce}>{userData.introduce ? userData.introduce : "자기소개를 작성해보세요!"}</p>
      </div>
    </div>
  )
}

export default ProfileHeader
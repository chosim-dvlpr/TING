import { useSelector } from "react-redux";

import styles from './ProfileHeader.module.css';

function ProfileHeader() {
  let userData = useSelector((state) => state.userdataReducer.userdata);

  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}> 
        <img src={`https://i9b107.p.ssafy.io:5157/user/profile/${userData.userId}`} />
      </div>

      <div className={styles.innerWrapper}>
        <h3 className={styles.nickname}>{ userData.nickname }</h3>
        <p className={styles.introduce}>{ userData.introduce ? userData.introduce :  "자기소개를 작성해보세요!"}</p>
      </div>
    </div>
  )
}

export default ProfileHeader
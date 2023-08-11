import { useSelector } from "react-redux";

import styles from "./ProfileHeader.module.css";
import ProfileImageEdit from "./ProfileImageEdit";
import { useEffect, useRef, useState } from "react";

function ProfileHeader() {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const [myImage, setMyImage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const baseURL ="https://i9b107.p.ssafy.io:5157";

  const openImageUploadModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {

  }, [userData.profileImage])

  // const handleImageUpload = (image) => {
  //   setUploadedImage(image);
  //   setIsModalOpen(false);
  // };

  // const editProfileImg = () => {
  //   setIsModalOpen(true); // 모달 열기
  //   console.log("이 부분에서 프로필 이미지 업로드 호출해야 함");
  //   console.log(userData);
  // };


  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>
        {uploadedImage ? (
          <img id={styles.profileImg} src={uploadedImage} />
        ) : userData.profileImage ? (
          <img
            ref={myImage}
            id={styles.profileImg}
            src={`${baseURL}/user/profile/${userData.userId}`}
          />
        ) : (
          <div id={styles.noImg}>
            프로필 이미지를<br />등록해보세요!
          </div>
        )}
        <img
          id={styles.editImg}
          src={process.env.PUBLIC_URL + "/img/pencil_icon.png"}
          onClick={openImageUploadModal}
        />
      </div>
      {
        isModalOpen && 
        <ProfileImageEdit setMyImage={setMyImage} />
      }

      <div className={styles.innerWrapper}>
        {/* ... 이전 코드 */}
      </div>
    </div>
  );
}

export default ProfileHeader;

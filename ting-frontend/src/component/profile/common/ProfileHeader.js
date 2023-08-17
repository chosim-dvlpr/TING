import { useSelector } from "react-redux";

import styles from "./ProfileHeader.module.css";
import { useEffect, useRef, useState } from "react";

import fileTokenHttp from "../../../api/fileTokenHttp";

function ProfileHeader() {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const [uploadedImage, setUploadedImage] = useState(null);
  const baseURL = "https://i9b107.p.ssafy.io:5157";

  const myImage = useRef();
  const formData = new FormData();

  // 파일 업로드
  const onUploadImage = (e) => {
    e.preventDefault();

    if (!e.target.files) {
      return;
    }

    formData.append("file", e.target.files[0]);
    sendImage(); // 서버로 파일 보내기
  };

  // 파일 api 보내기
  const sendImage = () => {
    fileTokenHttp.post("/user/profile", formData).then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        alert("프로필 이미지가 변경되었습니다.");
        // 현재 페이지 새로고침
        window.location.reload();
      } else {
        alert("파일 업로드에 실패하였습니다.");
      }
    });
  };

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
            프로필 이미지를
            <br />
            등록해보세요!
          </div>
        )}
        <label htmlFor="profileFile">
          <img
            id={styles.editImg}
            src={process.env.PUBLIC_URL + "/img/pencil_icon.png"}
          />
        </label>
        <input
          type="file"
          id="profileFile"
          style={{ display: "none" }}
          accept="image/*"
          onChange={onUploadImage}
        ></input>
      </div>
      <div className={styles.innerWrapper}>
        <div className={styles.nickname}>{userData.nickname}</div>
      </div>
    </div>
  );
}

export default ProfileHeader;

// 프로필 이미지 수정 미리보기 모달
import styles from "./ProfileImageEdit.module.css";
import { useSelector, useDispatch } from "react-redux";
import fileTokenHttp from "../../../api/fileTokenHttp";
import { useNavigate } from "react-router-dom";

function ProfileImageEdit({ changeNewImage, closeModal }) {
  // let signupReducer = useSelector((state) => state.signupReducer);
  const formData = new FormData();
  let navigate = useNavigate();
  let dispatch = useDispatch();

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
        alert("이미지 업로드 성공");
        closeModal();
        // navigate("/mypage");
        // 현재 페이지 새로고침
        window.location.reload();
      } else {
        console.log("파일 업로드 실패");
      }
    });
    // changeNewImage();
  };

  return (
    <div className={styles.Modal}>
      <div
        className={styles.modalOuter}
        onClick={() => {
          closeModal();
        }}
      ></div>
      <div className={styles.modalBody}>
        <div className={styles.inputModal}>
          <input
            type="file"
            accept="image/*"
            onChange={onUploadImage}
            // ref={setMyImage}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default ProfileImageEdit;

// 프로필 이미지 수정 미리보기 모달
import { useEffect, useRef, useState } from 'react';
import styles from './ProfileImageEdit.module.css';
import { useSelector } from 'react-redux';
import fileTokenHttp from '../../../api/fileTokenHttp';
// import { Button } from "@mui/material";


function ProfileImageEdit({ setMyImage }) {
  // let signupReducer = useSelector((state) => state.signupReducer);
  const formData = new FormData();

  // 파일 업로드
  const onUploadImage = (e) => {
    e.preventDefault();

    if (!e.target.files) {
      return;
    }

    formData.append('file', e.target.files[0]);
    sendImage(); // 서버로 파일 보내기
  }
  
  // 파일 api 보내기
  const sendImage = () => {
    fileTokenHttp.post("/user/profile", formData).then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        alert("이미지 업로드 성공");
      }
      else {
        console.log('파일 업로드 실패');
      }
    });
  }
  

  return (
    <div className={styles.Modal}>
      <div>
        <input type='file' accept='image/*' onChange={onUploadImage} ref={setMyImage}></input>
      </div>
    </div>

  )
}

export default ProfileImageEdit;
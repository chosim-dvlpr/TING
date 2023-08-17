import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIntroduce, setProfileImage } from "../../../redux/signup";
import basicHttp from "../../../api/basicHttp";
import fileHttp from "../../../api/fileHttp";

function ProfileImage(){
  let Navigate = useNavigate();
  let signupReducer = useSelector((state) => state.signupReducer);
  const email = signupReducer.email;
  const password = signupReducer.password;
  const formData = new FormData();

  // 파일 업로드
  // 업로드된 이미지 보낼 때 이메일, 비밀번호 함께 보내기 (유저 확인)
  const onUploadImage = (e) => {
    e.preventDefault();

    if (!e.target.files) {
      return;
    }

    formData.append('file', e.target.files[0]);
    formData.append("email", email);
    formData.append("password", password);
  }

  // 파일 api 보내기
  const goToLogin = (MoveTo) => {
    fileHttp.post("/user/profile/noToken", formData).then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        // setCheckDataList([...checkDataList[0], 1]);
        alert("회원가입이 완료되었습니다.");
        Navigate(MoveTo);
      }
      else {
        console.log('파일 업로드 실패')
      }
    });
  };

  return(
    <div className="Introduce">
      <div>
        <h3>프로필 사진을 업로드해주세요!</h3>
        <input type="file" accept='image/*' onChange={onUploadImage}></input>
      </div>
      <div>
        <button onClick={() => goToLogin("/login")}>로그인 하러 가기</button>
      </div>
    </div>
  )
}

export default ProfileImage;
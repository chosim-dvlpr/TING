import { useState } from "react"
import tokenHttp from "../../api/tokenHttp";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userdata";

import commonStyles from "./ProfileCommon.module.css";

function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkData, setCheckData] = useState([false, false]);
  let userdata = useSelector((state) => state.userdataReducer.userdata);

  let Navigate = useNavigate();
  let dispatch = useDispatch();

  // 비밀번호 불러오기
  const checkUserPassword = async () => {
    let data = {
      password: password
    };

    try {
      const response = await tokenHttp.post('/user/check', data);
      console.log('비밀번호 불러오기', response);

      if (response.data.code === 200) {
        console.log('불러오기 성공');
        // 비밀번호 일치 시
        if (response.data.data) {
          console.log('비밀번호 일치');
          return true;
        }
        // 비밀번호 불일치
        else {
          console.log('비밀번호 불일치');
          return false;
        }
      } else if (response.data.code === 400) {
        console.log('비밀번호 불러오기 실패');
      } else if (response.data.code === 401) {
        console.log('로그인이 필요합니다');
      } else if (response.data.code === 403) {
        console.log('권한이 없습니다');
      }
      return false;
    } catch (error) {
      console.log('비밀번호 불러오기 에러', error);
      return false;
    }
  };


  // 입력한 이메일과 비밀번호가 일치한지 확인
  const checkUserInput = async () => {
    console.log('아이디 비번 일치 확인')
    let isEmailValid = email === userdata.email;
    const isPasswordValid = await checkUserPassword();

    if (isEmailValid && isPasswordValid) {
      console.log('회원 탈퇴 axios 실행')
      if (window.confirm('탈퇴하시겠습니까?')) checkUserAxios();
    }
    else {
      console.log('유효한 이메일과 비밀번호 입력바람');
    }
  }

  // 회원 탈퇴
  const checkUserAxios = () => {
    tokenHttp.delete('/user').then((response) => {
      console.log('탈퇴', response)

      if (response.data.code === 200) {
        console.log('회원 탈퇴 성공');
        dispatch(logout()); // redux의 user 정보 삭제
        Navigate("/");
      }
      else if (response.data.code === 400) {
        console.log('회원 탈퇴 실패');
      }
      else if (response.data.code === 401) {
        console.log('로그인이 필요합니다')
      }
      else if (response.data.code === 403) {
        console.log('권한이 없습니다')
      }
    })
  }

  return (
    <div className={commonStyles.wrapper}>
      <p>이메일과 비밀번호를 확인해주세요.</p>
      {/* <label className={commonStyles.label} htmlFor='email'>이메일</label> */}
      <input className={commonStyles.input} type="text" id="email" placeholder="이메일" onChange={(e) => setEmail(e.target.value)}></input>
      <br></br>
      {/* <label className={commonStyles.label} htmlFor='password'>비밀번호</label> */}
      <input className={commonStyles.input} type="password" id="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)}></input>
      <br></br>
      <button className={commonStyles.btn} type="submit" onClick={() => checkUserInput()}>회원 탈퇴</button>
    </div>
  )
}

export default DeleteAccount
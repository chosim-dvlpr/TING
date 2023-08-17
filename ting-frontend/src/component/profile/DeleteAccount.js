import { useState } from "react";
import tokenHttp from "../../api/tokenHttp";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userdata";

import commonStyles from "./ProfileCommon.module.css";

import Swal from "sweetalert2";

function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let userdata = useSelector((state) => state.userdataReducer.userdata);

  let Navigate = useNavigate();
  let dispatch = useDispatch();

  // 비밀번호 불러오기
  const checkUserPassword = async () => {
    let data = {
      password: password,
    };

    try {
      const response = await tokenHttp.post("/user/check", data);

      if (response.data.code === 200) {
        // 비밀번호 일치 시
        if (response.data.data) {
          return true;
        }
        // 비밀번호 불일치
        else {
          return false;
        }
      } else if (response.data.code === 400) {
        console.log("비밀번호 불러오기 실패");
      } else if (response.data.code === 401) {
        console.log("로그인이 필요합니다");
      } else if (response.data.code === 403) {
        console.log("권한이 없습니다");
      }
      return false;
    } catch (error) {
      console.log("비밀번호 불러오기 에러", error);
      return false;
    }
  };

  // 입력한 이메일과 비밀번호가 일치한지 확인
  const checkUserInput = async () => {
    let isEmailValid = email === userdata.email;
    const isPasswordValid = await checkUserPassword();

    if (isEmailValid && isPasswordValid) {
      Swal.fire({
        title: "탈퇴하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        width: 400,
      }).then((result) => {
        if (result.isConfirmed) {
          checkUserAxios();
        }
      });
      // if (window.confirm("탈퇴하시겠습니까?")) checkUserAxios();
    } else {
      Swal.fire({
        title: "이메일 또는 비밀번호가 \n올바르지 않습니다.",
        width: 400,
      });
    }
  };

  // 회원 탈퇴
  const checkUserAxios = () => {
    tokenHttp.delete("/user").then((response) => {
      if (response.data.code === 200) {
        dispatch(logout()); // redux의 user 정보 삭제
        Navigate("/");
      } else if (response.data.code === 400) {
        console.log("회원 탈퇴 실패");
      } else if (response.data.code === 401) {
        console.log("로그인이 필요합니다");
      } else if (response.data.code === 403) {
        console.log("권한이 없습니다");
      }
    });
  };

  return (
    <div className={commonStyles.wrapper}>
      <p>이메일과 비밀번호를 확인해주세요.</p>
      {/* <label className={commonStyles.label} htmlFor='email'>이메일</label> */}
      <input
        className={commonStyles.input}
        type="text"
        id="email"
        placeholder="이메일"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <br></br>
      {/* <label className={commonStyles.label} htmlFor='password'>비밀번호</label> */}
      <input
        className={commonStyles.input}
        type="password"
        id="password"
        placeholder="비밀번호"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <br></br>
      <button
        className={commonStyles.btn}
        type="submit"
        onClick={() => checkUserInput()}
      >
        회원 탈퇴
      </button>
    </div>
  );
}

export default DeleteAccount;

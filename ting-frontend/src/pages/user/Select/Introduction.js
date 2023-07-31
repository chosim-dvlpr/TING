import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIntroduction } from "../../../redux/signup";
import basicHttp from "../../../api/basicHttp";

function Introduction(){
  let [introduction, setIntroduction] = useState("");
  let dispatch = useDispatch();
  let Navigate = useNavigate();
  let signupReducer = useSelector((state) => state.signupReducer);

  const changeIntroduction = (introduction) => {
    dispatch(setIntroduction(introduction));
  };

  // 회원가입 완료 클릭 시
  const completeSignup = () => {
    // dispatch(setIntroduction(introduction));
    let selectionData = {
      profileImage: signupReducer.profileImage,
      mbtiCode: signupReducer.mbtiCode,
      heightCode: signupReducer.heightCode,
      drinkingCode: signupReducer.drinkingCode,
      smokingCode: signupReducer.smokingCode,
      religionCode: signupReducer.religionCode,
      hobbyCodeList: signupReducer.hobbyCodeList,
      jobCode: signupReducer.jobCode,
      personalityCodeList: signupReducer.personalityCodeList,
      introduction: signupReducer.introduction,
      styleCodeList: signupReducer.styleCodeList,
    }
    
    let data = {
      email: signupReducer.email,
      password: signupReducer.password,
      name: signupReducer.name,
      nickname: signupReducer.nickname,
      phoneNumber: signupReducer.phonenumber,
      gender: signupReducer.gender,
      birth: signupReducer.birth,
      region: signupReducer.region,
      ...selectionData
    }
    basicHttp.post('/user/signup', data).then((response) => {
      if (response.data.code === 200) {
        console.log(data)
        alert("회원가입이 완료되었습니다.");
        Navigate("/login");
      }
      else if (response.data.code === 400) {
        alert("회원 가입 실패");
      }
    })
  }

  return(
    <div className="Introduction">
      <h3>Introduction</h3>
      <input type="text" onChange={(e) => setIntroduction(e.target.value)}></input>
      <button onClick={completeSignup}>로그인 하러 가기</button>
    </div>
  )
}

export default Introduction
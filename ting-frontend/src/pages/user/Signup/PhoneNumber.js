import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../../api/basicHttp';

function SignUpPhoneNumber(){
  const Navigate = useNavigate()
  // let [phonenumber, setPhonenumber] = useState("")
  let phonenumber = useSelector((state) => state.signupReducer.phonenumber)
  let dispatch = useDispatch();
  
  const checkPhonenumber = () => {
    // 연락처에 '-' 제거 필요
    basicHttp.get(`/user/phoneauth/${phonenumber}`).then((response) => {
      if (response.data.code === 200) {
        alert("인증 메세지가 전송되었습니다.");
        Navigate("/signup/certPhonenum");
      }
      else if (response.data.code === 400) {
        alert("인증 실패");
      }
      else if (response.data.code === 401) {
        alert("문자 발송에 실패했습니다. 다시 인증해주세요.");
      }
    })
    .catch(() => console.log("실패"));
  }

  return(
    <div>
      <label htmlFor='phonenumber'>전화번호를 입력해주세요</label>
      <br/>
      <input type="text" id="phonenumber" onChange={(e) => {dispatch({type: "TEXT", phonenumber: e.target.value})}} placeholder="전화번호('-'제외)"/>
      <button onClick={checkPhonenumber()}>인증하기</button>
      <p>{ phonenumber}</p>
    </div>
    )
  }


export default SignUpPhoneNumber
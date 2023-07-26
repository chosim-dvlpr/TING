import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../../api/basicHttp';

function InputEmail(){
  // let [email, setEmail] = useState("")
  let email = useSelector((state) => state.signupReducer.email);
  let [msg, setMsg] = useState("");
  const Navigate = useNavigate()

  let dispatch = useDispatch();

  return(
    <div>
      <label htmlFor='email'>이메일을 입력해주세요</label>
      <br/>
      {/* <input type="text" id="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일"/> */}
      <input type="text" id="email" onChange={(e) => {
        if (e.target.value) { // 값이 비어있지 않을 때
          dispatch({ type: "TEXT", email: e.target.value })
        }
        }} placeholder="이메일"/>
      <button onClick={() => {
          basicHttp.get(`/user/email/${email}`).then((response) => {
            // 중복체크 성공 시 인증화면으로 이동
            if (response.data.code === 200) {
              alert("인증 메일이 전송되었습니다.");
              Navigate("/signup/certEmail");
            }
            else {
              console.log("중복");
              setMsg(response.data.message);
            }
          })
          .catch(() => console.log("실패"))
        }}>중복체크</button>
      <br />
      {msg}
      {/* <button onClick={()=>{ Navigate("/signup/certEmail")}}>인증하기</button> */}
    </div>
  )
}

export default InputEmail
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../../api/basicHttp';

function InputEmail(){
  // let [email, setEmail] = useState("")
  let email = useSelector((state) => state.signupReducer.email )
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
      <button onClick={()=>{
          basicHttp.get(`/user/email/${email}`).then((response) => {
            if (response.code === 200) {
              console.log('성공');
            }
          })
          .catch(() => console.log("실패"))
        }}>중복체크</button>
      <button onClick={()=>{ Navigate("/signup/certEmail")}}>인증하기</button>
    </div>
  )
}

export default InputEmail
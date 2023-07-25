import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Password(){
  const Navigate = useNavigate()
  let [password, setPassword] = useState("")
  let [passwordCheck, setPasswordCheck] = useState("")


  return(
    <div>
      <label htmlFor='password'>비밀번호를 입력해주세요</label>
      <br/>
      <input type="password" id="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="비밀번호"/>
      <p>영문/숫자/특수문자 모두 포함, 8자 이상</p>
      <input type="password" id="passwordCheck" onChange={(e) => {setPasswordCheck(e.target.value)}} placeholder="비밀번호 확인"/>
      <br/>
      <button onClick={()=>{ Navigate("/signup/phonenum")}}>인증하기</button>
    </div>
  )
}

export default Password
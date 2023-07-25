import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function InputEmail(){
  let [email, setEmail] = useState("")
  const Navigate = useNavigate()

  return(
    <div>
      <label htmlFor='email'>이메일을 입력해주세요</label>
      <br/>
      <input type="text" id="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일"/>
      <button onClick={()=>{ Navigate("/signup/certEmail")}}>인증하기</button>
    </div>
  )
}

export default InputEmail
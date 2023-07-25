import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CertificationEmail(){
  let [email, setEmail] = useState("")
  const Navigate = useNavigate()

  return(
    <div>
      <h1>이메일 인증</h1>
      <div>
        <label htmlFor='email'>이메일을 입력해주세요</label>
        <br/>
        <input type="text" id="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일"/>
        <br/>
        <input type="text" onChange={(e) => {}} placeholder="인증번호 6자리"/>
        <br/>
        <button onClick={()=>{ Navigate("/signup/password")}}>다음</button>
    </div>

    </div>
  )
}

export default CertificationEmail

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function CertificationEmail(){
  // let [email, setEmail] = useState("")
  let email = useSelector((state) => state.signupReducer.email);
  const Navigate = useNavigate()

  return(
    <div>
      <h1>이메일 인증</h1>
      <div>
        <label htmlFor='email'>이메일을 입력해주세요</label>
        <br/>
        {/* 이메일 수정 불가 */}
        <input type="text" id="email" value={ email } readOnly />
        <br/>
        <input type="text" onChange={() => { }} placeholder="인증번호 6자리"/>
        <br/>
        
        <br/>
        <button onClick={()=>{ Navigate("/signup/password")}}>다음</button>
    </div>

    </div>
  )
}

export default CertificationEmail

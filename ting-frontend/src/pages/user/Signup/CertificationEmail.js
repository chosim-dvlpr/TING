import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../../api/basicHttp';


function CertificationEmail(){
  // let [email, setEmail] = useState("")
  let email = useSelector((state) => state.signupReducer.email);
  const Navigate = useNavigate()

  let dispatch = useDispatch();

  const checkEmail = () => {
    basicHttp.get('/user/emailauth').then((response) => {
      if (response.data.code === 200) {
        alert("인증 성공");
        Navigate("/signup/password");
      }
      else if (response.data.code === 400) {
        alert("인증 실패");
      }
      else if (response.data.code === 401) {
        alert("유효하지 않은 인증코드입니다.");
      }
    })
    .catch(() => console.log("실패"))
  };

  return(
    <div>
      <h1>이메일 인증</h1>
      <div>
        <label htmlFor='email'>이메일을 입력해주세요</label>
        <br/>
        {/* 이메일 수정 불가 */}
        <input type="text" id="email" value={ email } readOnly />
        <br/>
        <input type="text" placeholder="인증번호 6자리"/>
        <br/>
        <button onClick={checkEmail}>인증하기</button>
    </div>

    </div>
  )
}

export default CertificationEmail

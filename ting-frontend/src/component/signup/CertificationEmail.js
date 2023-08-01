import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../api/basicHttp';


function CertificationEmail(){
  let signupReducer = useSelector((state) => state.signupReducer);
  // let email = useSelector((state) => state.signupReducer.email);
  let [authCode, setAuthCode] = useState("");

  const Navigate = useNavigate()
  let dispatch = useDispatch();

  const checkEmail = () => {
    let data = {
      email: signupReducer.email,
      authCode: authCode,
    }

    basicHttp.post('/user/emailauth', data).then((response) => {
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
        <input type="text" id="email" value={ signupReducer.email } readOnly />
        <br/>
        <input type="text" onChange={(e) => setAuthCode(e.target.value) } placeholder="인증번호 6자리"/>
        <br/>
        <button onClick={checkEmail}>인증하기</button>
    </div>

    </div>
  )
}

export default CertificationEmail

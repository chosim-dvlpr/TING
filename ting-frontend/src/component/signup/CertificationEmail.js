import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../api/basicHttp';
import styles from './SignupCommon.module.css'


function CertificationEmail(){
  let signupReducer = useSelector((state) => state.signupReducer);
  // let email = useSelector((state) => state.signupReducer.email);
  let [authCode, setAuthCode] = useState("");

  const Navigate = useNavigate()
  let dispatch = useDispatch();

  const checkEmail = () => {
    let data = {
      // email: signupReducer.email,
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

  const authCodeInput = useRef();
  useEffect(() => {
    authCodeInput.current.focus();
  })
  // 엔터키로 버튼 누를 수 있게
  const activeEnter = (e) => {
    if(e.key === "Enter") {
      checkEmail();
    }
  }

  return(
    <div className={styles.wrapper}>
        <label className={styles.label} htmlFor='email'>이메일로 전송된 인증번호를 입력해주세요</label>
        {/* 이메일 수정 불가 */}
        <input className={styles.input} type="text" id="email" value={ signupReducer.email } readOnly />
        <input 
          ref={authCodeInput} 
          className={styles.input} 
          type="text" 
          onChange={(e) => setAuthCode(e.target.value) } 
          onKeyDown={(e) => activeEnter(e)}
          placeholder="인증번호 6자리"/>
        <br/>
        <button className={styles.btn} onClick={checkEmail}>인증하기</button>
    </div>
  )
}

export default CertificationEmail

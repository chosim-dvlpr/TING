import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../api/basicHttp';
import { setEmail } from '../../redux/signup';
import styles from './SignupCommon.module.css'

function InputEmail(){
  let [inputEmail, setInputEmail] = useState("");
  const emailInput = useRef();
  const authCodeInput = useRef();
  let [showInputCode, setShowInputCode] = useState(false);
  let [msg, setMsg] = useState("");
  let [authCode, setAuthCode] = useState("");
  let [isInputEmailDisabled, setIsInputEmailDisabled] = useState(false);
  let [isInputEmailCodeDisabled, setIsInputEmailCodeDisabled] = useState(false);
  
  let signupReducer = useSelector((state) => state.signupReducer);
  const Navigate = useNavigate()
  let dispatch = useDispatch();


  
  // // 이메일이 형식에 맞는지 확인
  // const checkData = () => {
  //   let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //   console.log(check.test(inputEmail))
  //   if (check.test(inputEmail)) {
  //     return true;
  //   }
  //   else { return false }; 
  // }
  
  // 이메일 중복 체크
  const checkEmail = () => {
    let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // console.log(check.test(inputEmail))
    setMsg("");
    if (check.test(inputEmail)) {
      basicHttp.get(`/user/email/${inputEmail}`).then((response) => {
        if (response.data.code === 200) {
          alert("인증 메일이 전송되었습니다.");
          setShowInputCode(true);
          setIsInputEmailDisabled(true);
        }
        else {
          console.log("중복");
          setMsg("중복된 이메일입니다. 다른 이메일을 입력해주세요.");
          emailInput.current.value = "";
        }
      })
    }
    
    else { alert("올바른 이메일을 입력해주세요.") }; 
    
  }

  // 엔터키로 버튼 누를 수 있게
  const activeEnter = (e, check) => {
    if(e.key === "Enter") {
      switch (check) {
        case checkEmailCode:
          
          checkEmailCode();
          break;
        case checkEmail:
          checkEmail();
          break;
      
        default:
          break;
      }
    }
  }

  // 이메일 코드 확인
  const checkEmailCode = () => {
    let data = {
      email: inputEmail,
      authCode: authCode,
    }

    basicHttp.post('/user/emailauth', data).then((response) => {
      if (response.data.code === 200) {
        setMsg("이메일 인증 성공");
        dispatch(setEmail(inputEmail)); // redux에 저장
        setIsInputEmailCodeDisabled(true);
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
    <div className={styles.wrapper}>
      <label 
        className={styles.label} 
        htmlFor='email'>
        이메일을 입력해주세요
      </label>

      {/* 중복확인 전 */}
      <input 
        ref={emailInput} 
        className={styles.input} 
        type="email" 
        id="email" 
        onChange={(e) => setInputEmail(e.target.value)} 
        onKeyDown={(e) => activeEnter(e, checkEmail)}
        placeholder="이메일"
        disabled={showInputCode} // code입력창 뜨면 disable되도록
      />
      { 
        !showInputCode &&
          <button 
            className={styles.btn} 
            onClick={() => {
              checkEmail();    // 중복 확인 실행
            }}
          >인증하기</button>
      }

      {/* 중복확인 & 인증메일 발송 뒤 */}
      {
        showInputCode &&
          (
            <>
              <input 
                className={styles.input} 
                type="text" 
                onChange={(e) => setAuthCode(e.target.value) } 
                onKeyDown={(e) => activeEnter(e, checkEmailCode)}
                placeholder="인증번호 6자리"
                disabled={isInputEmailCodeDisabled}/>
              <button 
                className={styles.btn} 
                onClick={checkEmailCode}
                onKeyDown={(e) => activeEnter(e, checkEmailCode)}
              >인증하기</button>
            </>
          )
      }
      

      <br />
      <span className={isInputEmailCodeDisabled 
        ? styles.rightMsg 
        : styles.wrongMsg}>{msg}</span>

    </div>
  )
}

export default InputEmail
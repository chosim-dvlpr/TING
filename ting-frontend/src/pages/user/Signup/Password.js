import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'


function Password(){
  const Navigate = useNavigate()
  let [password, setPassword] = useState("")
  let [passwordCheck, setPasswordCheck] = useState("")
  let [checkPasswordMsg, setCheckPasswordMsg] = useState("");
  let [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");
  // 버튼 활성화 여부
  let [isButtonDisabled, setIsButtonDisabled] = useState(true);


  // 비밀번호 유효성 확인
  let checkPassword = useCallback((passwordCheck) => {
    // 특수문자, 영문, 8-25자
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegex.test(passwordCheck)) {
      setCheckPasswordMsg("비밀번호가 형식에 맞지 않습니다.");
    }
    else {
      setCheckPasswordMsg("안전한 비밀번호입니다.");
    }
  });

  // 비밀번호 일치 확인
  let confirmPassword = useCallback((passwordCheck) => {
    if (!passwordCheck) {
      setConfirmPasswordMsg("비밀번호를 입력해주세요.");
    }
    else if (passwordCheck === password) {
      setConfirmPasswordMsg("비밀번호가 일치합니다.");
      setIsButtonDisabled(false);
    }
    else {
      setConfirmPasswordMsg("비밀번호가 일치하지 않습니다.");
    }
  }, [password]);


  useEffect(() => {
    confirmPassword(passwordCheck);
  }, [passwordCheck]);


  return(
    <div>
      <label htmlFor='password'>비밀번호를 입력해주세요</label>
      <br/>
      <input type="password" id="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="비밀번호"/>
      <p>영문/숫자/특수문자 모두 포함, 8자 이상</p>
      <p>{ checkPasswordMsg }</p>
      <input type="password" id="passwordCheck" onChange={(e) => {setPasswordCheck(e.target.value)}} placeholder="비밀번호 확인"/>
      <p>{ confirmPasswordMsg }</p>
      <button onClick={()=>{ Navigate("/signup/phonenum")}} disabled={isButtonDisabled}>인증하기</button>
    </div>
  )
}

export default Password
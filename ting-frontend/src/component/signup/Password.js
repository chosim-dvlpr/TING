import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setPassword } from "../../redux/signup";
import { useDispatch } from "react-redux";

import styles from './SignupCommon.module.css';

function Password() {
  let Navigate = useNavigate();
  let [inputPassword, setInputPassword] = useState("");
  let [inputPasswordCheck, setInputPasswordCheck] = useState("");
  let [checkPasswordMsg, setCheckPasswordMsg] = useState("test");
  let [confirmPasswordMsg, setConfirmPasswordMsg] = useState("test");
  // let [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 활성화 여부
  let [isPasswordPassed, setIsPasswordPassed] = useState(false); // 형식에 맞는 비밀번호인지 확인

  let dispatch = useDispatch();

  const checkPwdMsgP = useRef();
  const confirmPwdMsgP = useRef();
  
  // 비밀번호 형식 확인
  useEffect(() => {
    // 특수문자, 영문, 8-25자
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegex.test(inputPassword)) {
      setCheckPasswordMsg("비밀번호가 형식에 맞지 않습니다.");
      checkPwdMsgP.current.className = styles.wrongMsg;
      setIsPasswordPassed(false);
    }
    else {
      setCheckPasswordMsg("안전한 비밀번호입니다.");
      checkPwdMsgP.current.className = styles.rightMsg;
      setIsPasswordPassed(true);
    } 
  }, [inputPassword])

  // 비밀번호 일치 확인
  useEffect(() => {
    if (inputPassword && inputPassword === inputPasswordCheck) {
      setConfirmPasswordMsg("비밀번호가 일치합니다.");
      // setIsButtonDisabled(false); // 일치하면 다음 버튼 활성화
      confirmPwdMsgP.current.className = styles.rightMsg;
      setIsPasswordPassed(true);
    }
    else {
      setConfirmPasswordMsg("비밀번호가 일치하지 않습니다.");
      confirmPwdMsgP.current.className = styles.wrongMsg;
      setIsPasswordPassed(false);
    }
  }, [inputPassword, inputPasswordCheck])

  useEffect(() => {
    if (isPasswordPassed) {
      storePassword();    
    }
  }, [isPasswordPassed])

  // 다음 버튼 클릭 시 비밀번호 store에 저장
  const storePassword = () => {
    dispatch(setPassword(inputPasswordCheck));
  };

  return(
    <div className={styles.wrapper}>
      <label 
        className={styles.label} 
        htmlFor='password'
      >사용할 비밀번호를 입력해주세요</label>
      <p>영문/숫자/특수문자 모두 포함, 8자 이상</p>
      <div className={styles.passwordContainer}>
        <input 
          className={styles.input} 
          type="password" 
          id="password" 
          onChange={(e) => setInputPassword(e.target.value)} 
          placeholder="비밀번호"/>
        <p ref={checkPwdMsgP} 
          className={styles.wrongMsg}
        >{ 
          inputPassword &&
          checkPasswordMsg }
        </p>
      </div>
      <div className={styles.passwordContainer}>
        <input 
          className={styles.input} 
          type="password" 
          id="passwordCheck" 
          onChange={(e) => setInputPasswordCheck(e.target.value)} 
          placeholder="비밀번호 확인"/>
        <p ref={confirmPwdMsgP} 
          className={styles.wrongMsg}>
          { 
          inputPasswordCheck &&
          confirmPasswordMsg }
        </p>
      </div>
      {/* <button
        className={isButtonDisabled ? styles.disabledBtn : styles.btn} 
        onClick={()=>{
          Navigate("/signup/phonenum");
          storePassword();
        }} 
        disabled={isButtonDisabled}>다음</button> */}
    </div>
  )
}


export default Password

import { useEffect, useState, useRef } from "react";
import { setPassword } from "../../redux/signup";
import { useDispatch } from "react-redux";

import styles from "./SignupCommon.module.css";

function Password() {
  let [inputPassword, setInputPassword] = useState("");
  let [inputPasswordCheck, setInputPasswordCheck] = useState("");
  let [checkPasswordMsg, setCheckPasswordMsg] = useState("test");
  let [confirmPasswordMsg, setConfirmPasswordMsg] = useState("test");
  let [isPasswordPassed, setIsPasswordPassed] = useState(false); // 형식에 맞는 비밀번호인지 확인
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  let dispatch = useDispatch();

  const checkPwdMsgP = useRef();
  const confirmPwdMsgP = useRef();

  // 비밀번호 형식 확인
  useEffect(() => {
    // 특수문자, 영문, 8-25자
    let passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    let reg = /\s/g;
    if (
      !passwordRegex.test(inputPassword) |
      (inputPassword.search(reg) > -1) // 공백 있으면 오류메세지
    ) {
      setCheckPasswordMsg("비밀번호가 형식에 맞지 않습니다.");
      checkPwdMsgP.current.className = styles.wrongMsg;
      setIsPasswordPassed(false);
    } else {
      setCheckPasswordMsg("안전한 비밀번호입니다.");
      checkPwdMsgP.current.className = styles.rightMsg;
      setIsPasswordPassed(true);
    }
  }, [inputPassword]);

  // 비밀번호 일치 확인
  useEffect(() => {
    if (inputPassword && inputPassword === inputPasswordCheck) {
      setConfirmPasswordMsg("비밀번호가 일치합니다.");
      confirmPwdMsgP.current.className = styles.rightMsg;
      setIsPasswordPassed(true);
    } else {
      setConfirmPasswordMsg("비밀번호가 일치하지 않습니다.");
      confirmPwdMsgP.current.className = styles.wrongMsg;
      setIsPasswordPassed(false);
    }
  }, [inputPassword, inputPasswordCheck]);

  useEffect(() => {
    if (isPasswordPassed) {
      dispatch(setPassword(inputPasswordCheck));
    } else {
      dispatch(setPassword(null));
    }
  }, [isPasswordPassed]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.passwordContainer}>
        <div className={styles.passwordMessage}>
          <input
            className={`${styles.input} ${styles.pwdInput}`}
            type="password"
            id="password"
            onChange={(e) => setInputPassword(e.target.value)}
            onFocus={() => setShowPasswordMessage(true)}
            onBlur={() => setShowPasswordMessage(false)}
            placeholder="비밀번호"
          />
          {showPasswordMessage && (
            <div className={`${styles.nicknameMessage}`}>
              영문/숫자/특수문자 모두 포함, 8자 이상
            </div>
          )}
        </div>
        <div ref={checkPwdMsgP} className={styles.wrongMsg}>
          {inputPassword && checkPasswordMsg}
        </div>
      </div>
      <div className={styles.passwordContainer}>
        <input
          className={`${styles.input} ${styles.pwdInput}`}
          type="password"
          id="passwordCheck"
          onChange={(e) => setInputPasswordCheck(e.target.value)}
          placeholder="비밀번호 확인"
        />
        <p ref={confirmPwdMsgP} className={styles.wrongMsg}>
          {inputPasswordCheck && confirmPasswordMsg}
        </p>
      </div>
    </div>
  );
}

export default Password;

import { useDispatch } from "react-redux";
import styles from "./SignupCommon.module.css";
import { useEffect } from "react";
import { completeSignupStep } from "../../redux/signup";
import { useLocation, useNavigate } from "react-router";

function SignupComplete() {
  let dispatch = useDispatch();
  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    dispatch(completeSignupStep());
  }, [])

  return (
    <div>
      <div className={styles.completeContainer}>
        <h3>회원가입이 완료되었습니다</h3>
        <p className={styles.completeParagraph}>
          { location.state.name }님에 대해 더 알려주시면 <br /> 저희가 최선의 소개팅 상대를 찾아드려요.
        </p>
        <div className={styles.selectContainer}>
          <button className={styles.input} onClick={() => navigate("/signup/select")}>선택정보입력하기</button>
          <button className={styles.input} onClick={() => navigate("/login")}>로그인 하러가기</button>
        </div>
      </div>
    </div>
  );
}

export default SignupComplete;

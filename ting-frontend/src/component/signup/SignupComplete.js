import styles from "./SignupCommon.module.css";

function SignupComplete() {
  return (
    <div>
      <div className={styles.completeContainer}>
        <h3>회원가입이 완료되었습니다</h3>
        <p className={styles.completeParagraph}>
          OOO 님에 대해 더 알려주시면 <br /> 저희가 최선의 소개팅 상대를 찾아드려요.
        </p>
        <div className={styles.selectContainer}>
          <button className={styles.input}>선택정보입력하기</button>
          <button className={styles.input}>로그인 하러가기</button>
        </div>
      </div>
    </div>
  );
}

export default SignupComplete;

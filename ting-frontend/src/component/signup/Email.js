import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";

import basicHttp from "../../api/basicHttp";
import { setEmail } from "../../redux/signup";
import styles from "./SignupCommon.module.css";
import Spinner from "react-bootstrap/Spinner";

import Swal from "sweetalert2";

function InputEmail() {
  let [inputEmail, setInputEmail] = useState("");
  const emailInput = useRef();
  let [showInputCode, setShowInputCode] = useState(false);
  let [msg, setMsg] = useState("");
  let [authCode, setAuthCode] = useState("");
  let [isInputEmailDisabled, setIsInputEmailDisabled] = useState(false);
  let [isInputEmailCodeDisabled, setIsInputEmailCodeDisabled] = useState(false);
  const [isEmailMsgVisible, setIsEmailMsgVisible] = useState(false);
  let dispatch = useDispatch();

  const [showSpinner, setShowSpinner] = useState(false);

  // 이메일 중복 체크
  const checkEmail = async () => {
    let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    setMsg("");
    if (check.test(inputEmail)) {
      setShowSpinner(true);
      await basicHttp
        .get(`/user/email/${inputEmail}`)
        .then((response) => {
          setShowSpinner(false);
          if (response.data.code === 200) {
            Swal.fire({
              title: "인증 메일이 \n전송되었습니다.",
              width: 400,
            });
            setShowInputCode(true);
            setIsInputEmailDisabled(true);
          } else {
            Swal.fire({
              title: "중복된 이메일입니다. \n다른 이메일을 입력해주세요.",
              width: 400,
            });
            emailInput.current.value = "";
          }
        })
        .catch((e) => {
          setShowSpinner(false);
          Swal.fire({
            title: "인증 메일 전송에 \n실패하였습니다.",
            width: 400,
          });
        });
    } else {
      Swal.fire({
        title: "올바른 이메일을 \n입력해주세요.",
        width: 400,
      });
    }
  };

  // 엔터키로 버튼 누를 수 있게
  const activeEnter = (e, check) => {
    if (e.key === "Enter") {
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
  };

  // 이메일 코드 확인
  const checkEmailCode = () => {
    if (authCode.trim() === "") {
      Swal.fire({
        title: "인증번호를 입력해주세요.",
        width: 400,
      });
      return;
    }

    let data = {
      email: inputEmail,
      authCode: authCode,
    };

    basicHttp
      .post("/user/emailauth", data)
      .then((response) => {
        if (response.data.code === 200) {
          setMsg("이메일 인증 성공");
          setIsEmailMsgVisible(true);
          dispatch(setEmail(inputEmail)); // redux에 저장
          setIsInputEmailCodeDisabled(true);
        } else if (response.data.code === 400) {
          Swal.fire({
            title: "이메일 인증에 \n실패하였습니다.",
            width: 400,
          });
        } else if (response.data.code === 401) {
          Swal.fire({
            title: "유효하지 않은 \n인증코드입니다.",
            width: 400,
          });
        }
      })
      .catch((e) => {
        console.log(e.response.data.message);
        Swal.fire({
          title: "인증 코드가 \n올바르지 않습니다.",
          width: 400,
        });
      });
  };

  useEffect(() => {
    if (showInputCode) {
      // setMsg("인증 메일 전송 완료");
    }
  }, [showInputCode]);

  return (
    <div className={styles.wrapper}>
      {showSpinner && (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} animation="border" variant="primary" />
        </div>
      )}

      <br></br>

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
      <input
        className={`${styles.input} ${styles.code}`}
        type="text"
        onChange={(e) => setAuthCode(e.target.value)}
        onKeyDown={(e) => activeEnter(e, checkEmailCode)}
        placeholder="인증번호 6자리"
        disabled={isInputEmailCodeDisabled}
      />
      {!showInputCode && (
        <button
          className={`${styles.btn} ${styles.checkEmail}`}
          onClick={() => {
            checkEmail(); // 중복 확인 실행
          }}
        >
          인증 코드 전송
        </button>
      )}
      {/* 중복확인 & 인증메일 발송 뒤 */}
      {showInputCode && (
        <>
          <button
            className={`${!isInputEmailCodeDisabled && styles.btn} ${!isInputEmailCodeDisabled ? styles.checkEmail : styles.disabledBtn}`}
            onClick={checkEmailCode}
            onKeyDown={(e) => activeEnter(e, checkEmailCode)}
            disabled={isInputEmailCodeDisabled}
          >
            인증 코드 확인
          </button>
        </>
      )}

      <br />
      <p
        className={`
      ${isInputEmailCodeDisabled ? styles.rightMsg : styles.wrongMsg}
      `}
      >
        {msg}
      </p>
    </div>
  );
}

export default InputEmail;

import { useCallback, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import basicHttp from "../../api/basicHttp";
import { setPhoneNumber } from "../../redux/signup";

import styles from "./SignupCommon.module.css";

function CertificationPhonenumber() {
  // let phonenumber = useSelector((state) => state.signupReducer.phonenumber);

  let [phonenumberFirst, setPhonenumberFirst] = useState("");
  let [phonenumberMiddle, setPhonenumberMiddle] = useState("");
  let [phonenumberLast, setPhonenumberLast] = useState("");
  let [phonenumberInput, setPhonenumberInput] = useState("");
  let [phonenumberAuthCode, setPhonenumberAuthCode] = useState("");

  let [isCheckPhonenumCode, setIsCheckPhonenumCode] = useState(false); // 휴대전화 인증버튼 클릭 시 true
  let [isConfirmPhonenumCode, setIsConfirmPhonenumCode] = useState(false); // 휴대전화 인증 확인 시 true

  const onlyNumbersRegex = /^[0-9]*$/;
  const phonenumberFirstRef = useRef("");
  const phonenumberMiddleRef = useRef("");
  const phonenumberLastRef = useRef("");

  const Navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    if (!onlyNumbersRegex.test(phonenumberFirst)) {
      alert("숫자를 입력하세요.");
      phonenumberFirstRef.current.value = "";
    }
  }, [phonenumberFirst, phonenumberMiddle, phonenumberLast]);

  useEffect(() => {
    if (!onlyNumbersRegex.test(phonenumberMiddle)) {
      alert("숫자를 입력하세요.");
      phonenumberMiddleRef.current.value = "";
    }
  }, [phonenumberMiddle]);

  useEffect(() => {
    if (!onlyNumbersRegex.test(phonenumberLast)) {
      alert("숫자를 입력하세요.");
      phonenumberLastRef.current.value = "";
    }
  }, [phonenumberLast]);

  // 버튼 활성화 여부
  // let [isCertPhoneButtonDisabled, setIsCertPhoneButtonDisabled] = useState(true);

  // 전화번호 형식에 맞게 저장
  useEffect(() => {
    const fullPhoneNumber = String(checkNumber(phonenumberFirst)) + String(checkNumber(phonenumberMiddle)) + String(checkNumber(phonenumberLast));
    setPhonenumberInput(fullPhoneNumber);
  }, [phonenumberFirst, phonenumberMiddle, phonenumberLast]);

  // 숫자만 입력 가능하도록
  const checkNumber = (input) => {
    const onlyNumbersRegex = /^[0-9]*$/;
    if (onlyNumbersRegex.test(input)) {
      return input;
    } else {
      return false;
    }
  };

  const checkPhonenumberCode = () => {
    let data = {
      phoneNumber: phonenumberInput,
      authCode: phonenumberAuthCode,
    };

    if (data.authCode.length === 4) {
      basicHttp
        .post("/user/phoneauth", data)
        .then((response) => {
          if (response.data.code === 200) {
            alert("인증 성공");
            setIsConfirmPhonenumCode(true);
            return;
          } else if (response.data.code === 400) {
            alert("인증 실패");
          } else if (response.data.code === 401) {
            alert("문자 인증 실패");
          }
          setIsConfirmPhonenumCode(false);
        })
        .catch(() => console.log("실패"));
    } else {
      alert("올바른 인증 코드를 입력해주세요.");
    }
  };

  useEffect(() => {
    if (isConfirmPhonenumCode) {
      dispatch(setPhoneNumber(phonenumberInput)); // redux에 저장
    }
  }, [isConfirmPhonenumCode]);

  // 휴대전화 인증하기 버튼 클릭 시 실행
  const checkPhonenumber = () => {
    if (phonenumberInput.length !== 11) {
      alert("올바른 전화번호를 입력해주세요");
      return;
    }
    basicHttp
      .get(`/user/phoneauth/${phonenumberInput}`)
      .then((response) => {
        if (response.data.code === 200) {
          alert("인증 메세지가 전송되었습니다.");
          setIsCheckPhonenumCode(true);
        } else if (response.data.code === 400) {
          alert("인증 실패");
        } else if (response.data.code === 401) {
          alert("문자 발송에 실패했습니다. 다시 인증해주세요.");
        }
      })
      .catch(() => console.log("실패"));
  };

  // 엔터키로 버튼 누를 수 있게
  const activeEnter = (e, check) => {
    if (e.key === "Enter") {
      switch (check) {
        case checkPhonenumber:
          checkPhonenumber();
          break;
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="phonenumber">
        휴대폰 번호
      </label>
      <br></br>
      <div>
        {/* 휴대전화 인증 버튼 누르기 전 */}
        <input
          className={styles.phonenumInput}
          ref={phonenumberFirstRef}
          type="text"
          id="phonenumberFirst"
          onChange={(e) => {
            if (e.target.value.length == 3) {
              phonenumberMiddleRef.current.focus();
            }
            setPhonenumberFirst(e.target.value);
          }}
          maxLength={3}
          disabled={isCheckPhonenumCode}
        />
        <span>-</span>
        <input
          className={styles.phonenumInput}
          ref={phonenumberMiddleRef}
          type="text"
          id="phonenumberMiddle"
          onChange={(e) => {
            if (e.target.value.length == 4) {
              phonenumberLastRef.current.focus();
            }
            setPhonenumberMiddle(e.target.value);
          }}
          maxLength={4}
          disabled={isCheckPhonenumCode}
        />
        <span>-</span>
        <input
          className={styles.phonenumInput}
          ref={phonenumberLastRef}
          type="text"
          id="phonenumberLast"
          onChange={(e) => {setPhonenumberLast(e.target.value)}}
          onKeyDown={(e) => activeEnter(e, checkPhonenumber)}
          maxLength={4}
          disabled={isCheckPhonenumCode}
        />
      {!isCheckPhonenumCode && (
        <button 
        className={`${isConfirmPhonenumCode 
          ? styles.disabledBtn 
          : styles.btn}`} 
        onClick={checkPhonenumber}>
          인증하기
        </button>
      )}

      </div>
      {/* 인증하기 버튼 누른 뒤 인증번호 입력 */}
      {isCheckPhonenumCode && (
        <>
          <input
            className={styles.input}
            type="text"
            onChange={(e) => {
              setPhonenumberAuthCode(e.target.value);
            }}
            placeholder="인증번호 4자리"
            disabled={isConfirmPhonenumCode}
          />
          <button 
          className={`${isConfirmPhonenumCode 
            ? styles.disabledBtn 
            : styles.btn}`} 
          onClick={checkPhonenumberCode}>
            인증확인
          </button>
          {/* <button 
            className={styles.btn} 
            onClick={checkPhonenumber}>
            재전송
          </button> */}
        </>
      )}
      <p className={styles.rightMsg}>{isConfirmPhonenumCode && "휴대전화 인증 성공"}</p>
    </div>
  );
}

export default CertificationPhonenumber;

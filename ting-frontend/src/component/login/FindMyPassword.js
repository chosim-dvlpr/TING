import React, { useEffect, useRef } from "react";
import basicHttp from "../../api/basicHttp";
import { useState } from "react";
import styles from "../signup/SignupCommon.module.css";

function FindMyPassword() {
  let [name, setName] = useState("");
  let [phoneNumber, setPhoneNumber] = useState("");
  let [isButtonDisabled, setIsButtonDisabled] = useState(true);
  let [email, setEmail] = useState("");
  let [isTempPasswordSend, setIsTempPasswordSend] = useState(false);

  // 전화번호 인증 관련 state
  const [phonenumberFirst, setPhonenumberFirst] = useState("");
  const [phonenumberMiddle, setPhonenumberMiddle] = useState("");
  const [phonenumberLast, setPhonenumberLast] = useState("");

  // 전화번호 인증 관련 ref
  const phonenumberFirstRef = useRef();
  const phonenumberMiddleRef = useRef();
  const phonenumberLastRef = useRef();

  useEffect(() => {
    setIsButtonDisabled(false);
  }, []);

  const FindPasswordFunc = () => {
    if (!name) {
      alert("이름을 입력하세요");
    } else if (!(phonenumberFirst + phonenumberMiddle + phonenumberLast)) {
      alert("전화번호를 입력하세요");
    } else if (!email) {
      alert("이메일을 입력하세요");
    } else {
      let data = {
        name,
        phoneNumber: phonenumberFirst + phonenumberMiddle + phonenumberLast,
        email,
      };

      basicHttp
        .post("/user/password", data)
        .then((response) => {
          if (response.data.code === 200) {
            console.log("성공");
            setIsTempPasswordSend(true);
          } else {
            console.log("실패");
            setIsTempPasswordSend(false);
          }
        })
        .catch(() => {
          alert("비밀번호 찾기에 실패했습니다.");
          setIsTempPasswordSend(false);
        });
    }
  };

  return (
    <div>
      <input
        className={`${styles.input} ${styles.findPasswordInput}`}
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="이름"
        autoFocus
      />
      <br />
      {/* 전화번호 인증 */}
      <div>
        {/* 휴대전화 인증 버튼 누르기 전 */}
        <input
          className={`${styles.phonenumInput} ${styles.findPasswordPhonenumber}`}
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
        />
        <span>-</span>
        <input
          className={`${styles.phonenumInput} ${styles.findPasswordPhonenumber}`}
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
        />
        <span>-</span>
        <input
          className={`${styles.phonenumInput} ${styles.findPasswordPhonenumber}`}
          ref={phonenumberLastRef}
          type="text"
          id="phonenumberLast"
          onChange={(e) => {
            setPhonenumberLast(e.target.value);
          }}
          maxLength={4}
        />
      </div>
      <input
        className={`${styles.input} ${styles.findPasswordInput}`}
        type="text"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="이메일"
      />
      <br />
      <br></br>
      <button disabled={isButtonDisabled} className={`${styles.btn} ${styles.confirmBtn}`} onClick={FindPasswordFunc}>
        확인
      </button>
      <div>{isTempPasswordSend === true && <span style={{color: "blue"}}>임시 비밀번호가 전송 되었습니다.</span>}</div>
    </div>
  );
}
export default FindMyPassword;

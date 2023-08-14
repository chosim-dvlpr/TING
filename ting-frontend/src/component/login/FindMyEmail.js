import React, { useEffect, useRef } from "react";
import basicHttp from "../../api/basicHttp";
import { useState } from "react";

import styles from "../signup/SignupCommon.module.css";

function FindMyEmail() {
  let [name, setName] = useState("");
  let [isButtonDisabled, setIsButtonDisabled] = useState(true);
  let [email, setEmail] = useState("");
  let [resultMessage, setResultMessage] = useState("");

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

  const FindEmailFunc = () => {
    if (!name) {
      alert("이름을 입력하세요");
    } else if (!(phonenumberFirst + phonenumberMiddle + phonenumberLast)) {
      alert("전화번호를 입력하세요");
    } else {
      let data = {
        name,
        phoneNumber : phonenumberFirst + phonenumberMiddle + phonenumberLast,
      };

      basicHttp
        .post("/user/email", data)
        .then((response) => {
          if (response.data.code === 200) {
            console.log("성공");
            console.log(response.data);
            setEmail(response.data.data);
            setResultMessage(`아이디는 ${response.data.data}입니다.`);
          } else {
            console.log("실패");
            setResultMessage("아이디를 찾을 수 없습니다.");
          }
        })
        .catch(() => {
          setResultMessage("존재하지 않는 회원입니다.");
        });
    }
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <input
          className={styles.input}
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
          />
          <span>-</span>
          <input
            className={styles.phonenumInput}
            ref={phonenumberLastRef}
            type="text"
            id="phonenumberLast"
            onChange={(e) => {
              setPhonenumberLast(e.target.value);
            }}
            maxLength={4}
          />
        </div>
        <br />
        <button disabled={isButtonDisabled} className={isButtonDisabled ? styles.disabledBtn : styles.btn} onClick={FindEmailFunc}>
          확인
        </button>
        <div style={{marginTop: "20px", color: "red"}}>
          <span>{resultMessage}</span>
        </div>
      </div>
    </div>
  );
}

export default FindMyEmail;

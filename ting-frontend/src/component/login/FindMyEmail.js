import React, { useEffect, useRef } from "react";
import basicHttp from "../../api/basicHttp";
import { useState } from "react";

import styles from "../../pages/FindMyInfoPage.module.css";

import Swal from "sweetalert2";

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
      Swal.fire({ title: "이름을 입력하세요.", width: 400 });
    } else if (!(phonenumberFirst + phonenumberMiddle + phonenumberLast)) {
      Swal.fire({ title: "전화번호를 입력하세요.", width: 400 });
    } else {
      let data = {
        name,
        phoneNumber: phonenumberFirst + phonenumberMiddle + phonenumberLast,
      };

      basicHttp
        .post("/user/email", data)
        .then((response) => {
          if (response.data.code === 200) {
            setEmail(response.data.data);
            setResultMessage(`아이디는 ${response.data.data}입니다.`);
          } else {
            setResultMessage("아이디를 찾을 수 없습니다.");
          }
        })
        .catch((error) => {
          console.log(error.response);
          setResultMessage("존재하지 않는 회원입니다.");
        });
    }
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <label className={styles.label}>이름</label>
        <input
          className={styles.input}
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
          autoFocus
        />
        <br />

        {/* 전화번호 인증 */}
        <div>
          {/* 휴대전화 인증 버튼 누르기 전 */}
          <label className={styles.label}>휴대폰 번호</label>
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
        <button
          disabled={isButtonDisabled}
          className={isButtonDisabled ? styles.disabledBtn : styles.btn}
          onClick={FindEmailFunc}
        >
          확인
        </button>
      </div>
      <div style={{ marginTop: "20px", color: "red", fontSize: "20px" }}>
        <span>{resultMessage}</span>
      </div>
    </div>
  );
}

export default FindMyEmail;

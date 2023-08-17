import React, { useEffect, useRef } from "react";
import basicHttp from "../../api/basicHttp";
import { useState } from "react";

import styles from "../../pages/FindMyInfoPage.module.css";

import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";

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

  // Spinner 관련 state
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(false);
  }, []);

  const FindPasswordFunc = () => {
    if (!name) {
      Swal.fire({ title: "이름을 입력하세요.", width: 400 });
    } else if (!(phonenumberFirst + phonenumberMiddle + phonenumberLast)) {
      Swal.fire({ title: "전화번호를 입력하세요.", width: 400 });
    } else if (!email) {
      Swal.fire({ title: "이메일을 입력하세요.", width: 400 });
    } else {
      let data = {
        name,
        phoneNumber: phonenumberFirst + phonenumberMiddle + phonenumberLast,
        email,
      };

      setShowSpinner(true);
      basicHttp
        .post("/user/password", data)
        .then((response) => {
          setShowSpinner(false);
          if (response.data.code === 200) {
            Swal.fire({
              title: "임시 비밀번호가 \n이메일로 전송되었습니다.",
              width: 400,
            });
            setName("");
            setPhoneNumber("");
            setEmail("");
            // setIsTempPasswordSend(true);
          } else {
            Swal.fire({
              title: "비밀번호 찾기에 \n실패했습니다.",
              width: 400,
            });
            // setIsTempPasswordSend(false);
          }
        })
        .catch((error) => {
          setShowSpinner(false);
          console.log(error.response);
          if (error.response.data.code === 4100) {
            Swal.fire({
              title: "비밀번호를 찾을 수 없습니다.\n 입력하신 정보를 다시 한번 \n확인해주세요.",
              width: 400,
            });
          } else {
            Swal.fire({
              title: "비밀번호 찾기에 \n실패했습니다.",
              width: 400,
            });
            // setIsTempPasswordSend(false);
          }
        });
    }
  };

  return (
    <div className={styles.wrapper}>
      {showSpinner && (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} animation="border" variant="primary" />
        </div>
      )}

      <label className={styles.label}>이름</label>
      <input
        className={`${styles.input} ${styles.findPasswordInput}`}
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
      <label className={styles.label}>이메일</label>
      <input
        className={`${styles.input} ${styles.findPasswordInput}`}
        type="text"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <br></br>
      <button disabled={isButtonDisabled} className={`${styles.btn} ${styles.confirmBtn}`} onClick={FindPasswordFunc}>
        확인
      </button>
      {/* <div>
        {isTempPasswordSend === true && (
          <span style={{ color: "blue" }}>
            임시 비밀번호가 전송 되었습니다.
          </span>
        )}
      </div> */}
    </div>
  );
}
export default FindMyPassword;

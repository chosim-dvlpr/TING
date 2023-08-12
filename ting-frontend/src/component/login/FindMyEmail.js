import React, { useEffect } from "react";
import basicHttp from "../../api/basicHttp";
import { useState } from "react";

import styles from "./FindMyEmail.module.css";

function FindMyEmail() {
  let [name, setName] = useState("");
  let [phoneNumber, setPhoneNumber] = useState("");
  let [isButtonDisabled, setIsButtonDisabled] = useState(true);
  let [email, setEmail] = useState("");
  
  useEffect(() => {
    setIsButtonDisabled(false);
  });

  const FindEmailFunc = () => {
    if (!name) {
      alert("이름을 입력하세요");
    } else if (!phoneNumber) {
      alert("전화번호를 입력하세요");
    } else {
      let data = {
        name,
        phoneNumber,
      };

      basicHttp.post("/user/email", data).then((response) => {
        if (response.data.code === 200) {
          console.log("성공");
          console.log(response.data)
          setEmail(response.data.data)
        } else {
            console.log("실패")
        }
      });
    }
  };

  return (
    <div>
      <h1>아이디(이메일)찾기</h1>
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
        <input
          className={styles.input}
          type="text"
          id="phonenumber"
          onChange={(e) => {
            if (e.target.value.length === 13) {
              setIsButtonDisabled(false);
              setPhoneNumber(e.target.value);
            }
          }}
          placeholder="전화번호('-'제외)"
        />
        <button className={isButtonDisabled ? styles.disabledBtn : styles.btn} 
         onClick={FindEmailFunc}>
          확인
        </button>
        <div>
          
          <span>아이디는 {email} 입니다.</span>
        </div>
      </div>
    </div>
  );
}

export default FindMyEmail;

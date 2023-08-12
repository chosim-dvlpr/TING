import React, {useEffect} from "react";
import basicHttp from "../../api/basicHttp";
import { useState } from "react";

import styles from "./FindMyPassword.module.css";

function FindMyPassword() {
  let [name, setName] = useState("");
  let [phoneNumber, setPhoneNumber] = useState("");
  let [isButtonDisabled, setIsButtonDisabled] = useState(true);
  let [email, setEmail] = useState("");
  let [isTempPasswordSend, setIsTempPasswordSend] = useState(false);


  useEffect(() => {
    setIsButtonDisabled(false);
  }, []);


  const FindPasswordFunc = () => {
    if (!name) {
      alert("이름을 입력하세요");
    } else if (!phoneNumber) {
      alert("전화번호를 입력하세요");
    } else if (!email){
      alert("이메일을 입력하세요")
    } else {
      let data = {
        name,
        phoneNumber,
        email,
      };

      basicHttp.post("/user/password", data).then((response) => {
        if (response.data.code === 200) {
          console.log("성공");
          setIsTempPasswordSend(true);
        } else {
          console.log("실패");
          setIsTempPasswordSend(false);
        }
      });
    }
  };

  return (
    <div>
      <h1>비밀번호 찾기</h1>
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
          if (e.target.value.length === 11 || e.target.value.length === 13) {
            setPhoneNumber(e.target.value);
          }
        }}
        placeholder="전화번호('-'제외)"
      />
      <br />
      <input
        className={styles.input}
        type="text"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="이메일"
      />
      <button disabled={isButtonDisabled} className={isButtonDisabled ? styles.disabledBtn : styles.btn} 
      onClick={FindPasswordFunc}>확인</button>
      <div>
        {isTempPasswordSend === true && (
          <span>임시 비밀번호가 전송 되었습니다.</span>
        )}
      </div>
    </div>
  );
}
export default FindMyPassword;

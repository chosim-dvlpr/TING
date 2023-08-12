import React from "react";

import FindMyEmail from "../component/login/FindMyEmail";
import FindMyPassword from "../component/login/FindMyPassword";
import styles from "./FindMyInfoPage.module.css";
import NavBar from "../component/common/NavBar";

function FindMyInfoPage() {
  return (
    <div className={styles.outer}>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>아이디 찾기</h1>
        <FindMyEmail />
        <br />
        <br />
        <br />
        <h1 className={styles.title}>비밀번호 찾기</h1>
        <FindMyPassword />
      </div>
    </div>
  );
}

export default FindMyInfoPage;

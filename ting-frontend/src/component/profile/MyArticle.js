// import axios from "axios";
import React, { useState, useRef } from "react";
import MyArticleAdvice from "./MyArticleAdvice";
import MyArticleIssue from "./MyArticleIssue";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./MyArticle.module.css";

function MyArticle() {
  let [issueBoard, setIssueBoard] = useState(true); // 논쟁 게시판을 초기값으로

  const issueBtn = useRef();
  const adviceBtn = useRef();

  // 논쟁 게시판 보여주기
  const showIssueBoard = () => {
    setIssueBoard(true);
    issueBtn.current.className = styles.yesClicked;
    adviceBtn.current.className = styles.noClicked;
  };

  // 상담 게시판 보여주기
  const showAdviceBoard = () => {
    setIssueBoard(false);
    issueBtn.current.className = styles.noClicked;
    adviceBtn.current.className = styles.yesClicked;
  };

  return (
    <div className={commonStyles.wrapper}>
      <div className={styles.headerWrapper}>
        <div
          ref={issueBtn}
          className={styles.yesClicked}
          onClick={() => showIssueBoard()}
        >
          논쟁 게시판
        </div>
        <div
          ref={adviceBtn}
          className={styles.noClicked}
          onClick={() => showAdviceBoard()}
        >
          상담 게시판
        </div>
      </div>

      {issueBoard ? <MyArticleIssue /> : <MyArticleAdvice />}
    </div>
  );
}
export default MyArticle;

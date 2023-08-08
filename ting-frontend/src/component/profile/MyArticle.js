// import axios from "axios";
import React, { useState } from "react";
import MyArticleAdvice from "./MyArticleAdvice";
import MyArticleIssue from "./MyArticleIssue";

function MyArticle() {
  let [issueBoard, setIssueBoard] = useState(true); // 논쟁 게시판을 초기값으로
  // let [adviceBoard, setAdviceBoard] = useEffect(false); // 상담 게시판

  // 논쟁 게시판 보여주기
  const showIssueBoard = () => {
    setIssueBoard(true);
  };

  // 상담 게시판 보여주기
  const showAdviceBoard = () => {
    setIssueBoard(false);
  };

  return (
    <div>
      <h2>내가 작성한 게시글</h2>
      <button onClick={() => showIssueBoard()}>논쟁 게시판</button>
      <button onClick={() => showAdviceBoard()}>상담 게시판</button>

      {
        issueBoard ?
        <MyArticleIssue /> :
        <MyArticleAdvice />
      }

    </div>
  )
}
export default MyArticle;

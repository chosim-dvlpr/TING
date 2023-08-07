import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./IssueDetail.module.css";
import CommentCreate from "../common/CommentCreate";
import tokenHttp from "../../../api/tokenHttp";
import CommentList from "../common/CommentList";

function IssueDetail() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getIssueDetail();
    getCommentList();
  }, []);

  useEffect(() => {
    console.log("==========", issue);
  }, [issue])

  const getIssueDetail = async () => {
    try {
      const response = await tokenHttp.get(`/issue/${issueId}`);
      console.log("issue response", response);
      const data = response.data.data;
      console.log("data", data);
      setIssue({...data});  
    } catch (error) {
      console.error("Error fetching issue detail:", error);
    }
  };

  const getCommentList = async () => {
    try {
      const response = await tokenHttp.get(`/comment/ISSUE/${issueId}`);
      const commentData = response.data.data;
      setComments(commentData); // 댓글 목록 데이터 설정
    } catch (error) {
      console.error("Error fetching comment list:", error);
    }
  };

  if (!issue) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.issueDetailContainer}>
      <h1>{issue.title}</h1>
      <p>작성자: {issue.nickname}</p>
      <p>{issue.agreeTitle} {issue.agreeCount}</p>
      <p>{issue.opposeTitle} {issue.oppseCount}</p>

      <CommentList comments={comments} />

      <CommentCreate boardTypeProp="ISSUE" boardIdProp={issue.issueId} getCommentList={getCommentList}/>

    </div>
  );
}

export default IssueDetail;

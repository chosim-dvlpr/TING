import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./AdviceDetail.module.css";
import CommentCreate from "../common/CommentCreate";
import tokenHttp from "../../../api/tokenHttp";
import CommentList from "../common/CommentList";

function AdviceDetail() {
  const { adviceId } = useParams();
  const [advice, setAdvice] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getAdviceDetail();
    getCommentList();
  }, []);

  useEffect(() => {
    console.log("==========", advice);
  }, [advice])

  const getAdviceDetail = async () => {
    try {
      const response = await tokenHttp.get(`/advice/${adviceId}`);
      console.log("advice response", response);
      const data = response.data.data;
      console.log("data", data);
      setAdvice({...data});  
    } catch (error) {
      console.error("Error fetching advice detail:", error);
    }
  };

  const getCommentList = async () => {
    try {
      const response = await tokenHttp.get(`/comment/ADVICE/${adviceId}`);
      const commentData = response.data.data;
      setComments(commentData); // 댓글 목록 데이터 설정
    } catch (error) {
      console.error("Error fetching comment list:", error);
    }
  };

  if (!advice) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adviceDetailContainer}>
      <h1>{advice.title}</h1>
      <p>Content: {advice.content}</p>
      <p>Created Time: {advice.createdTime}</p>
      <p>Modified Time: {advice.modifiedTime}</p>

      <CommentList comments={comments} />

      <CommentCreate boardTypeProp="ADVICE" boardIdProp={advice.adviceId} getCommentList={getCommentList}/>

    </div>
  );
}

export default AdviceDetail;

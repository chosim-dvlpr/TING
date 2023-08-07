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

  const handleUpdateComment = async (commentId, content) => {
    try {
      // 댓글 수정 로직 구현
      const response = await tokenHttp.put(`/comment/${commentId}`, { content: content });
      console.log("Edit comment response:", response);
  
      // 댓글 목록을 다시 가져와서 업데이트
      getCommentList();

    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  
  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await tokenHttp.delete(`/comment/${commentId}`);
      console.log("Delete comment response:", response);
      
      
      const updatedComments = comments.filter(comment => comment.commentId !== commentId);
      setComments(updatedComments);
  
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  

  return (
    <div className={styles.adviceDetailContainer}>
      <h1>{advice.title}</h1>
      <p>Content: {advice.content}</p>
      <p>Created Time: {advice.createdTime}</p>
      <p>Modified Time: {advice.modifiedTime}</p>

      <CommentList
        comments={comments}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />

      <CommentCreate boardTypeProp="ADVICE" boardIdProp={advice.adviceId} getCommentList={getCommentList} />

    </div>
  );
}

export default AdviceDetail;

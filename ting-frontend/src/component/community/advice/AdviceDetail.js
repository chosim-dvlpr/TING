import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./AdviceDetail.module.css";
import CommentCreate from "../common/CommentCreate";
import tokenHttp from "../../../api/tokenHttp";
import CommentList from "../common/CommentList";
import NavBar from "../../common/NavBar";
import Sidebar from "../common/Sidebar";
import adviceStyles from "./AdviceBoard.module.css";
import {getDate} from "../../common/TimeCalculate";

function AdviceDetail() {
  const { adviceId } = useParams();
  const [advice, setAdvice] = useState({});
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const showbutton = (nickname) => {
    return userdata && userdata.nickname === nickname;
  }

  useEffect(() => {
    getAdviceDetail();
    getCommentList();
  }, []);

  useEffect(() => {
    console.log("==========", advice);
  }, [advice]);

  const getAdviceDetail = async () => {
    try {
      const response = await tokenHttp.get(`/advice/${adviceId}`);
      console.log("advice response", response);
      const data = response.data.data;
      console.log("data", data);
      setAdvice({ ...data });
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
      const response = await tokenHttp.put(`/comment/${commentId}`, {
        content: content,
      });
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

      const updatedComments = comments.filter(
        (comment) => comment.commentId !== commentId
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  
  // 글 수정
  const handleUpdate = (adviceId) => {
    navigate(`/community/advice/update/${adviceId}`);
  };

  // 글 삭제
  const handleDelete = async (adviceId) => {
    try {
      await tokenHttp.delete(`advice/${adviceId}`);
      console.log("delete성공");
      alert("글이 정상적으로 삭제 되었습니다")
      navigate("/community/advice");
      
    } catch (error) {
      console.error("Error deleting advice:", error);
    }
  };

  return (
    <div className={adviceStyles.adviceBoardBackground}>
      <NavBar />
      <div className={adviceStyles.adviceBoardContainer}>
        <Sidebar />
        <div className={styles.deleteButtonContainer}>
        {showbutton(advice.nickname) && (
          <button className={styles.deleteButton}>
            <div>
              <span onClick={() => handleUpdate(advice.adviceId)}>수정</span>
            </div>
          </button>
        )}
        {showbutton(advice.nickname) && (
          <button className={styles.deleteButton}>
            <div>
              <span onClick={() => handleDelete(advice.adviceId)}>삭제</span>
            </div>
          </button>
        )}
        </div>
        <div className={styles.adviceDetailContainer}>
          <div className={styles.detailTop}>
            <div className={styles.title}>{advice.title}</div>
            <div className={styles.time}>{advice.modifiedTime === null
              ? getDate(advice.createdTime)
              : `${getDate(advice.modifiedTime)} (수정됨)`}</div>
            <div className={styles.hit}>{advice.hit}</div>
          </div>
          <div className={styles.content}>{advice.content}</div>
          <CommentCreate
            boardTypeProp="ADVICE"
            boardIdProp={advice.adviceId}
            getCommentList={getCommentList}
          />
          <CommentList
            comments={comments}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            boardType="ADVICE"
            boardId={advice.adviceId}
          />
        </div>
      </div>
    </div>
  );
}

export default AdviceDetail;

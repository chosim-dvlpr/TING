import React, { useState } from "react";
import { useSelector } from "react-redux";
import CommentLikeButton from "./CommentLikeButton"; 
import styles from "./CommentList.module.css";
import {getDate} from "../../common/TimeCalculate";

function CommentList({ comments, onUpdateComment, onDeleteComment }) {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const userdata = useSelector((state) => state.userdataReducer.userdata); // Redux의 userdata 상태 가져오기
  const showbutton = (nickname) => {
    return userdata && userdata.nickname === nickname
  };

  // 댓글 수정
  const handleUpdate = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  // 댓글 작성 취소
  const handleCancelUpdate = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  // 댓글 수정 저장
  const handleSaveUpdate = async (commentId) => {
    try {
      await onUpdateComment(commentId, editedContent);
      setEditingCommentId(null);
      setEditedContent("");
      console.log(commentId);
    } catch (error) {
      console.error("댓글 수정 에러:", error);
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    try {
      const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
      if (confirmDelete) {
        await onDeleteComment(commentId);
      }
    } catch (error) {
      console.error("댓글 삭제 에러:", error);
    }
  };

  // 댓글 좋아요
  const handleUpdateLikes = (commentId, newLikes) => {
    // 좋아요 수 업데이트를 처리하는 로직 추가
    const updatedComments = comments.map((comment) =>
      comment.commentId === commentId
        ? { ...comment, likeCount: newLikes }
        : comment
    );

  };

  // 댓글 없는 경우 처리
  if (!comments || comments.length === 0) {
    return <p>댓글이 없습니다.</p>;
  }

  return (
    <div>
      {comments.map((comment) => {
        if (comment.removed) {
          return null;
        }
        return (
          <div key={comment.commentId} className={styles["comment-container"]}>
            <div className={styles["comment-details"]}>
              {editingCommentId === comment.commentId ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleSaveUpdate(comment.commentId)}
                    className={styles["update-button"]}
                  >
                    저장
                  </button>
                  <button onClick={handleCancelUpdate}>취소</button>
                </div>
              ) : (
                // 댓글 div
                <div className={styles.comment}>
                <span className={styles["nickname"]}>{comment.nickname}</span>
                  <p className={styles["comment-content"]}>{comment.content}</p>
                  <span className={styles["comment-time"]}>
                    {comment.modifiedTime === null
                      ? getDate(comment.createdTime)
                      : `${getDate(comment.modifiedTime)} (수정됨)`}</span>
                <span className={styles["comment-like-button"]}>
                  <CommentLikeButton commentId={comment.commentId}
                    initialLikes={comment.likeCount}
                    onUpdateLikes={handleUpdateLikes}/></span>

                        

                <div>
                {showbutton(comment.nickname) && (<button onClick={() => handleUpdate(comment.commentId, comment.content)} className={styles["edit-button"]}>
                  수정
                </button>)}
                {showbutton(comment.nickname) && (<button onClick={() => handleDelete(comment.commentId)} className={styles["delete-button"]}>
                 삭제
                </button>)}
                </div>
              </div>
              )}
            </div>
          </div>
        );
      })}
  </div>
);
}

export default CommentList;
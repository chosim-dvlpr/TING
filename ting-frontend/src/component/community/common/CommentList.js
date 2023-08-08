import React, { useState } from "react";
import CommentLikeButton from "./CommentLikeButton"; 

function CommentList({ comments, onUpdateComment, onDeleteComment }) {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleUpdate = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  const handleCancelUpdate = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

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

  const handleUpdateLikes = (commentId, newLikes) => {
    // 좋아요 수 업데이트를 처리하는 로직 추가
    const updatedComments = comments.map((comment) =>
      comment.commentId === commentId
        ? { ...comment, likeCount: newLikes }
        : comment
    );


  };

  if (!comments || comments.length === 0) {
    return <p>댓글이 없습니다.</p>;
  }

  return (
    <div>
    <h2>댓글 목록</h2>
    <ul>
      {comments.map((comment) => {
        if (comment.removed) {
          return null; 
        }
        
        return (
          <li key={comment.commentId}>
            <div>
              {editingCommentId === comment.commentId ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={() => handleSaveUpdate(comment.commentId)}>
                    저장
                  </button>
                  <button onClick={handleCancelUpdate}>취소</button>
                </div>
              ) : (
                <div>
                  <p>내용: {comment.content}</p>
                  <p>  <CommentLikeButton
                      commentId={comment.commentId}
                      initialLikes={comment.likeCount}
                      onUpdateLikes={handleUpdateLikes}
                    /> </p>
                  <p>작성 시간: {comment.createdTime}</p>
                  <p>수정 시간: {comment.modifiedTime || "수정 시간 없음"}</p>
                  <p>삭제 여부: {comment.removed ? "삭제됨" : "삭제 안됨"}</p>
                  <button
                    onClick={() =>
                      handleUpdate(comment.commentId, comment.content)
                    }
                  >
                    댓글 수정
                  </button>
                  <button onClick={() => handleDelete(comment.commentId)}>
                    댓글 삭제
                  </button>
                </div>
              )}
            </div>
          </li>
        );
        })}
      </ul>
    </div>
  );
  }

export default CommentList;

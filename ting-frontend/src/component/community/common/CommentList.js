import React from "react";

function CommentList({ comments }) {

    if (!comments || comments.length === 0) {
        return <p>댓글이 없습니다.</p>;
      }

  return (
    <div>
      <h2>댓글 목록</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.commentId}>
            <p>댓글 내용: {comment.content}</p>
            <p>좋아요 수: {comment.likeCount}</p>
            <p>작성 시간: {comment.createdTime}</p>
            <p>수정 시간: {comment.modifiedTime || "수정 시간 없음"}</p>
            <p>삭제 여부: {comment.removed ? "삭제됨" : "삭제 안됨"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;

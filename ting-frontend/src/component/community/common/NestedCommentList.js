import React, { useState, useEffect } from "react";
import tokenHttp from "../../../api/tokenHttp";


function NestedCommentList({ boardType, boardId, commentId }) {
  const [nestedComments, setNestedComments] = useState([]);

  useEffect(() => {
    // 서버로부터 대댓글 목록을 가져와서 state에 설정하는 함수
    const fetchNestedComments = async () => {
      try {
        const response = await tokenHttp.get(`/comment/${boardType}/${boardId}/${commentId}`);
        setNestedComments(response.data);
      } catch (error) {
        console.error("대댓글 조회 에러:", error);
      }
    };

    fetchNestedComments();
  }, [boardType, boardId, commentId]);

  return (
    <div>
      <h3>대댓글 목록</h3>
      <ul>
        {nestedComments.map((nestedComment) => (
          <li key={nestedComment.commentId}>
            <div>
              <p>내용: {nestedComment.content}</p>
              <p>작성 시간: {nestedComment.createdTime}</p>
              {/* 추가적인 댓글 정보들 표시 */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NestedCommentList;

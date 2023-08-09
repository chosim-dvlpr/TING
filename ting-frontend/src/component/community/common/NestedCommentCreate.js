import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tokenHttp from "../../../api/tokenHttp";

function NestedCommentCreate({ boardType, boardId, parentCommentId, getCommentList }) {
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = () => {
    tokenHttp
      .get("/user") // 사용자 정보를 가져오는 요청 (필요에 따라 수정)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login"); // 로그인 페이지로 이동하는 로직 추가
      return;
    }

    const nestedCommentData = {
      boardType: boardType,
      boardId: boardId,
      content: comment,
      depth: 1, // 대댓글이므로 depth는 1로 설정
      parent: parentCommentId, // 대댓글의 부모 댓글 ID 설정
    };

    try {
      const response = await tokenHttp.post("/comment", nestedCommentData);
      if (response.status === 200) {
        alert("대댓글 작성이 완료되었습니다.");
        setComment("");
        getCommentList(); // 댓글 목록을 다시 불러옴으로써 대댓글이 화면에 나타나도록 갱신
      } else {
        throw new Error("Failed to save the nested comment.");
      }
    } catch (error) {
      console.error("Error saving the nested comment", error);
    }
  };

  return (
    <div>
      <h3>대댓글 작성</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nestedComment">대댓글</label>
          <input
            type="text"
            id="nestedComment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  );
}

export default NestedCommentCreate;

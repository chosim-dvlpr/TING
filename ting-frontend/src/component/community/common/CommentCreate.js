import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tokenHttp from "../../../api/tokenHttp";
import styles from "./CommentCreate.module.css";

function CommentCreate({
  boardTypeProp,
  boardIdProp,
  getCommentList,
  parentCommentId,
}) {
  // 글 작성 시 바로 commentlist로
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [depth, setDepth] = useState(0);
  const [parent, setParent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();

    setDepth(0); // 0 또는 1로 설정
    setParent(null); // 대댓글의 부모 댓글 ID 설정 (대댓글이 아닌 경우 null)
  }, []);

  const fetchUserInfo = () => {
    tokenHttp
      .get("/user")
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
      navigate("/login");
      return;
    }

    const commentData = {
      boardType: boardTypeProp,
      boardId: boardIdProp,
      content: comment,
      depth: depth,
      parent: parent,
    };

    try {
      console.log(commentData);
      const response = await tokenHttp.post("/comment", commentData);
      console.log("Server response:", response);
      if (response.status === 200) {
        alert("댓글 작성이 완료되었습니다");
        setComment("");

        getCommentList();
      } else {
        throw new Error("Failed to save the post");
      }
    } catch (error) {
      console.error("Error saving the post", error);
    }
  };

  return (
    <div className={styles["comment-form"]}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="comment"></label>
          <input
            type="text"
            placeholder="댓글 작성하기"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles["comment-input"]}
          />
        </div>
        <div>
          <button type="submit" className={styles["comment-button"]}>
            저장
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentCreate;
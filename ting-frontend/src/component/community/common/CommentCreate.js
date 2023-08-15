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
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [depth, setDepth] = useState(0);
  const [parent, setParent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();

    setDepth(0);
    setParent(null);
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

    if (comment.trim() === "") {
      // 댓글 내용이 공백인 경우 저장 동작을 막음
      console.log("댓글 내용이 공백입니다. 저장되지 않습니다.");
      alert("내용을 입력해주세요.")
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
          <label htmlFor="comment"></label>
          <input
            type="text"
            placeholder="댓글 작성하기"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles["comment-input"]}
          />
          <button type="submit" className={styles["comment-button"]}>
            저장
          </button>
      </form>
    </div>
  );
}

export default CommentCreate;

import React, { useState } from "react";
import tokenHttp from "../../../api/tokenHttp";
import styles from "./CommentLikeButton.module.css";

function CommentLikeButton({
  commentId,
  initialLiked,
  initialLikes,
  onUpdateLikes,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);

  const handleLikeClick = async () => {
    try {
      const newLikes = liked ? likes - 1 : likes + 1;
      if (liked) {
        await deleteLike(commentId, newLikes);
      } else {
        await updateLikesOnServer(commentId, newLikes);
      }
      setLikes(newLikes);
      setLiked(!liked);
    } catch (error) {
      console.error("좋아요 업데이트 에러:", error);
    }
  };

  const updateLikesOnServer = async (commentId, newLikes) => {
    try {
      const response = await tokenHttp.post(`/comment/like/${commentId}`);
      if (response.status === 200) {
        onUpdateLikes(commentId, newLikes);
      } else {
        console.error("좋아요 업데이트 실패");
      }
    } catch (error) {
      console.error("좋아요 업데이트 에러:", error);
    }
  };

  const deleteLike = async (commentId, newLikes) => {
    try {
      const response = await tokenHttp.delete(`/comment/like/${commentId}`);
      if (response.status === 200) {
        onUpdateLikes(commentId, newLikes);
      } else {
        console.error("좋아요 삭제 실패");
      }
    } catch (error) {
      console.error("좋아요 삭제 에러:", error);
    }
  };

  return (
    <div className={styles.buttonContainer} onClick={handleLikeClick}>
      {liked ? (
        <img
          className={styles.heartIcon}
          src="/img/filled-heart.png"
          alt="Filled Heart"
        />
      ) : (
        <img
          className={styles.heartIcon}
          src="/img/empty-heart.png"
          alt="Empty Heart"
        />
      )}
      좋아요 {likes}
    </div>
  );
}

export default CommentLikeButton;

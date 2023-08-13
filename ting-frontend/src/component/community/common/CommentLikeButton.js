import React, { useEffect, useState } from "react";
import tokenHttp from "../../../api/tokenHttp";
import styles from "./CommentLikeButton.module.css";
import { async } from "q";

function CommentLikeButton({ commentId, initialLiked, initialLikes, onUpdateLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);


  // useEffect(()=>{
  //   // 좋아요가 눌렸는지 안눌렸는지 확인
  //   // 눌렷으면 setLiked(true)
  //   // 아니면 패스
  // })

  const handleLikeClick = async () => {
    try {
      const newLikes = liked ? likes - 1 : likes + 1;
      if(liked) {
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

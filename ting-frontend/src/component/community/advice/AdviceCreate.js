import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tokenHttp from "../../../api/tokenHttp";
import styles from "./AdviceCreate.module.css"; // module.css 파일을 가져옵니다
import NavBar from "../../common/NavBar";

const AdviceCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
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

    const newPost = {
      title: title,
      content: content,
    };

    try {
      const response = await tokenHttp.post("/advice", newPost);
      if (response.status === 200) {
        navigate("/community/advice");
      } else {
        throw new Error("Failed to save the post");
      }
    } catch (error) {
      console.error("Error saving the post:", error);
    }
  };

  return (
    <div>
      {/* <NavBar /> */}
      <div className={styles.formContainer}>
        <h2>당신의 사랑 고민은 무엇인가요?</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className={styles.textAreaField}
            />
          </div>
          <div>
            <button type="submit" className={styles.submitButton}>
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdviceCreate;

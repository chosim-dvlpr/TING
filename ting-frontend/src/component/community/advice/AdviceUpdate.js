import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import styles from "./AdviceUpdate.module.css";
import tokenHttp from "../../../api/tokenHttp";

function AdviceUpdate() {
  const { adviceId } = useParams(); 
  const navigate = useNavigate(); // useNavigate 추가
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getAdviceDetail();
  }, []);

  const getAdviceDetail = async () => {
    try {
      const response = await axios.get(`https://i9b107.p.ssafy.io:5157/advice/${adviceId}`);
      const data = response.data.data;
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error("Error fetching advice detail:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = { title, content };
      await tokenHttp.put(`https://i9b107.p.ssafy.io:5157/advice/${adviceId}`, updatedData);
      setIsUpdated(true);
    } catch (error) {
      console.error("Error updating advice:", error);
    }
  };

  const handleUpdateComplete = () => {
    alert("수정이 완료되었습니다.");
    navigate(`/community/advice`); 
  };

  useEffect(() => {
    if (isUpdated) {
      handleUpdateComplete();
    }
  }, [isUpdated]);

  return (
    <div className={styles.adviceUpdateContainer}>
      <h2>글 수정</h2>
      <div>
        <label htmlFor="title">제목:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content">내용:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button onClick={handleUpdate}>수정 완료</button>
    </div>
  );
}

export default AdviceUpdate;

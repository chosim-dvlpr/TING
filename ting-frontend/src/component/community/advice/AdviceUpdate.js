import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import styles from "./AdviceUpdate.module.css";
import tokenHttp from "../../../api/tokenHttp";
import basicHttp from "../../../api/basicHttp";
import NavBar from "../../common/NavBar";

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
      const response = await tokenHttp.get(`/advice/${adviceId}`);
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
      await tokenHttp.put(`/advice/${adviceId}`, updatedData);
  
      // 수정이 완료되면 서버에서 수정된 데이터를 다시 가져옴
      const response = await basicHttp.get(`/advice/${adviceId}`);
      const data = response.data.data;
      setTitle(data.title);
      setContent(data.content);
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
    <div>
    {/* <NavBar/> */}
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
    </div> 
  );
}

export default AdviceUpdate;

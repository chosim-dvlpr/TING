import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./AdviceDetail.module.css"; 
function AdviceDetail() {
    const { adviceId } = useParams(); // URL 경로에서 adviceId 가져오기
    const [advice, setAdvice] = useState([]);

    useEffect(() => {
        getAdviceDetail();
    }, []);

    const getAdviceDetail = async () => {
        try {
            const response = await axios.get(`https://i9b107.p.ssafy.io:5157/advice/${adviceId}`);
            const data = response.data.data;
            setAdvice(data); 
        } catch (error) {
            console.error("Error fetching advice detail:", error);
        }
    };

    if (!advice) {
        return <div>Loading...</div>; // 데이터 로딩 중일 때
    }

    return (
        <div className={styles.adviceDetailContainer}>
            <h1>{advice.title}</h1>
            <p>Nickname: {advice.nickname}</p>
            <p>Hit: {advice.hit}</p>
            <p>Created Time: {advice.createdTime}</p>
            <p>Modified Time: {advice.modifiedTime}</p>
            <p>Content: {advice.content}</p>
        </div>
    );
}

export default AdviceDetail;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdviceUpdate.module.css";
import tokenHttp from "../../../api/tokenHttp";
import basicHttp from "../../../api/basicHttp";
import NavBar from "../../common/NavBar";
import Sidebar from "../common/Sidebar";
import adviceStyles from "./AdviceBoard.module.css";
import FriendButton from "../../common/FriendButton";

import Swal from "sweetalert2";

function AdviceUpdate() {
  const { adviceId } = useParams();
  const navigate = useNavigate(); // useNavigate 추가
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);

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
    Swal.fire({ title: "수정이 완료되었습니다.", width: 400 });
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
      <div className={adviceStyles.adviceBoardBackground}>
        <NavBar />
        {userdata && (
          <FriendButton
            toggleWheelHandler={() =>
              setWheelHandlerActive((active) => !active)
            }
          />
        )}
        <div className={adviceStyles.adviceBoardContainer}>
          <Sidebar />
          <div className={styles.adviceUpdateContainer}>
            <h2>글 수정</h2>
            <div className={styles.updateTop}>
              제목 |
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.updateContent}>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <button onClick={handleUpdate}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdviceUpdate;

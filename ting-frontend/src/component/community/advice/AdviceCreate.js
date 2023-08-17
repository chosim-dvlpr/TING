import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import tokenHttp from "../../../api/tokenHttp";
import styles from "./AdviceCreate.module.css"; // module.css 파일을 가져옵니다
import NavBar from "../../common/NavBar";
import Sidebar from "../common/Sidebar";
import adviceStyles from "./AdviceBoard.module.css";
import FriendButton from "../../common/FriendButton";

import Swal from "sweetalert2";

const AdviceCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata);
  const [wheelHandlerActive, setWheelHandlerActive] = useState(true);

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

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle === "" || trimmedContent === "") {
      Swal.fire({ title: "제목 또는 내용을 \n입력해주세요.", width: 400 });
      return;
    }

    const newPost = {
      title: trimmedTitle,
      content: trimmedContent,
    };

    try {
      const response = await tokenHttp.post("/advice", newPost);
      if (response.status === 200) {
        Swal.fire({ title: "작성이 완료되었습니다.", width: 400 });
        navigate("/community/advice");
      } else {
        Swal.fire({ title: "게시글 작성에 실패하였습니다.", width: 400 });
        throw new Error("Failed to save the post");
      }
    } catch (error) {
      Swal.fire({ title: "게시글 작성에 실패하였습니다.", width: 400 });
      console.error("Error saving the post:", error);
    }
  };
  return (
    <div>
      {/* <NavBar /> */}
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
          <div className={styles.formContainer}>
            <h2>당신의 사랑 고민은 무엇인가요?</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.createTop}>
                제목 |{" "}
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </div>
              <div className={styles.createContent}>
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
      </div>
    </div>
  );
};

export default AdviceCreate;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { userdataReducer } from "./../../../redux/userdata";
import tokenHttp from "../../../api/tokenHttp";
import styles from "./Report.module.css";
import Swal from "sweetalert2";

function Report({ setShowReportModal, session }) {
  const state = useSelector((state) => state);
  // state
  const [reportContent, setReportContent] = useState("");

  // react router
  const navigate = useNavigate();

  // 신고 내용 state에 바인딩
  const handleInputChange = (e) => {
    setReportContent(e.target.value);
  };

  // 신고 완료 버튼 클릭
  const handleSubmit = () => {
    if (reportContent === "") {
      alert("신고 내용을 입력해주세요.");
    } else {
      // 서버로 신고 내용 전송
      console.log("finalMatchingId", state.finalMatchingReducer.matchingId);
      tokenHttp.post("/report", {
        type: "MATCHING",
        content: reportContent,
        typeId: state.finalMatchingReducer.matchingId,
      });

      // 상대에게 신고 신호 전달 (나와 상대방이 방에서 나가짐)
      session.signal({
        type: "report",
        to: [],
        data: JSON.stringify({ userId: state.userdataReducer.userdata.userId }),
      });

      reportAlert();
    }
  };

  // 신고 완료 경고창
  const reportAlert = () => {
    // alert("신고가 완료되었습니다.")
    Swal.fire({
      icon: "success",
      title: "신고 완료",
      text: "메인으로 돌아갑니다",
    }).then((res) => {
      navigate("/");
    });
  };

  // 취소 버튼 클릭
  const onClose = () => {
    setShowReportModal(false);
  };

  return (
    <div className={styles.ModalOuter}>
      <div className={styles.ModalInner}>
        <h3>신고하기</h3>
        <p>허위 신고 시에는 불이익을 받으실수 있습니다.</p>
        <textarea className={styles.ReportContent} placeholder="신고 내용을 입력해주세요." onChange={handleInputChange} />
        <button className={styles.SuccessBtn} onClick={handleSubmit}>
          신고 완료
        </button>
        <button className={styles.CancelBtn} onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
}

export default Report;

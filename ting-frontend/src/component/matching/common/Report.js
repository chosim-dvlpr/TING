import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { userdataReducer } from "./../../../redux/userdata";

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
      session.signal({
        type: "report",
        to: [],
        data: JSON.stringify({ userId: state.userdataReducer.userdata.userId }),
      });

      alert("신고가 완료되었습니다.");
      navigate("/");
    }
  };

  // 취소 버튼 클릭
  const onClose = () => {
    setShowReportModal(false);
  };

  return (
    <div style={{ width: "300px", height: "400px" }}>
      <h3>신고하기</h3>
      <textarea rows="4" cols="50" placeholder="신고 내용을 입력해주세요." onChange={handleInputChange} />
      <button onClick={handleSubmit}>신고 완료</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
}

export default Report;

import { useSearchParams } from "react-router-dom";
import styles from "./css/ReportDetail.module.css";
import { useEffect, useRef, useState } from "react";
import tokenHttp from "../../api/tokenHttp";

import Button from "react-bootstrap/Button";

const ReportDetail = () => {
  const [searchParams, setSeratchParams] = useSearchParams();
  const [reportedUser, setReportedUser] = useState({});
  const [report, setReport] = useState({});
  const [comment, setComment] = useState("");

  const commentRef = useRef();

  useEffect(() => {
    const reportedUserId = searchParams.get("reportedUserId");
    const reportId = searchParams.get("reportId");

    // 신고대상 유저 정보 불러오기
    tokenHttp
      .get(`/admin/user/${reportedUserId}`)
      .then((response) => {
        setReportedUser(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // 신고내역 상세정보 불러오기
    tokenHttp
      .get(`/admin/report/${reportId}`)
      .then((response) => {
        setReport(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchParams]);

  const changeCommentHandler = () => {
    setComment(commentRef.current.value);
  };

  // 신고 의견 등록하기
  const registerComment = () => {
    tokenHttp
      .post("/admin/report", { reportId: report.reportId, comment: comment })
      .then(() => {
        alert("관리자 의견이 등록되었습니다.");
      })
      .catch(() => {
        alert("관리자 의견 등록에 실패하였습니다.");
      });
  };

  // 유저 삭제하기
  const deleteUser = () => {
    if (window.confirm("정말 유저를 삭제하시겠습니까?")) {
      tokenHttp
        .delete(`/admin/user/${report.reportedUserId}`)
        .then(() => {
          alert("유저가 삭제되었습니다.");
        })
        .catch(() => {
          alert("유저 삭제에 실패하였습니다.");
        });
    }
  };

  return (
    <div>
      <div className={styles.title}>ReportDetail</div>
      <div className={styles.detailContainer}>
        <div className={styles.detail}>
          <div className={styles.userInfo}>
            <div className={styles.subTitle}>신고대상 유저 정보</div>
            <table className={styles.userInfoTb}>
              <tr>
                <th>사용자 ID</th>
                <td>{reportedUser.userId}</td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>{reportedUser.email}</td>
              </tr>
              <tr>
                <th>이름</th>
                <td>{reportedUser.name}</td>
              </tr>
              <tr>
                <th>닉네임</th>
                <td>{reportedUser.nickname}</td>
              </tr>
            </table>
          </div>
          <div className={styles.reportInfo}>
            <div className={styles.subTitle}>신고 정보</div>
            <div className={styles.reportInfoDetail}>
              <div>ID: {report.reportId}</div>
              <div>신고대상 유저: {report.userNickname}</div>
              <div>신고 내용: {report.content}</div>
            </div>
            <div className={styles.commentDiv}>
              <label>관리자 의견</label>
              <div>
                <input type="text" onChange={changeCommentHandler} ref={commentRef} />
                <Button
                  variant="secondary"
                  onClick={() => {
                    registerComment();
                  }}
                >
                  등록하기
                </Button>
              </div>
            </div>
            <div className={styles.btnDiv}>
              <Button variant="warning">신고대상 유저 경고</Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteUser();
                }}
              >
                신고대상 유저 삭제
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;

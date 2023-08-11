import { useSearchParams } from "react-router-dom";
import styles from "./css/ReportDetail.module.css";
import { useEffect, useState } from "react";
import tokenHttp from "../../api/tokenHttp";

const ReportDetail = () => {
  const [searchParams, setSeratchParams] = useSearchParams();
  const [reportedUser, setReportedUser] = useState({});
  const [report, setReport] = useState({});

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

  return (
    <div>
      <div className={styles.title}>ReportDetail</div>
      <div className={styles.detailContainer}>
        <div className={styles.detail}>
          <div className={styles.userInfo}>
            <div>신고대상 유저 정보</div>
            <div>
              <div>{reportedUser.userId}</div>
              <div>{reportedUser.email}</div>
              <div>{reportedUser.name}</div>
              <div>{reportedUser.nickname}</div>
            </div>
          </div>
          <div className={styles.reportInfo}>
            <div>신고 정보</div>
            <div>{report.reportId}</div>
            <div>{report.userNickname}</div>
            <div>{report.content}</div>
            <div>
              <input type="text" value={report.comment} />
            </div>
            <div><button>신고대상 유저 경고</button></div>
            <div><button>신고대상 유저 삭제</button></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;

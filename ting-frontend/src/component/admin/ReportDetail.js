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

    tokenHttp.get("")
    
  }, [searchParams]);

  return (
    <div>
      <div className={styles.title}>ReportDetail</div>
      <div className={styles.detailContainer}>
        <div className={styles.detail}>
          <div>유저 정보</div>
          <div>신고 정보</div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;

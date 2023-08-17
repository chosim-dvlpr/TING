import styles from "./css/Dashboard.module.css";
import { PriceChart } from "./PriceChart";
import { MatchingChart } from "./MatchingChart";
import { useEffect, useState } from "react";
import tokenHttp from "../../api/tokenHttp";

const Dashboard = () => {
  const [matchingCount, setMatchingCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    tokenHttp
      .get("/admin/matching/count")
      .then((response) => {
        setMatchingCount(response.data.data["totalCount"]);
      })
      .catch((error) => {});

    tokenHttp
      .get("/admin/user/count")
      .then((response) => {
        setUserCount(response.data.data["totalCount"]);
      })
      .catch((error) => {});

    tokenHttp
      .get("/admin/report/count")
      .then((response) => {
        setReportCount(response.data.data["totalCount"]);
      })
      .catch((error) => {});

    tokenHttp
      .get("/admin/profit/total")
      .then((response) => {
        setTotalProfit(response.data.data["totalProfit"]);
      })
      .catch((error) => {});
  }, []);

  return (
    <div>
      <div className={styles.title}>Dashboard</div>

      <div className={styles.summaryContainer}>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>
            <img src={`${process.env.PUBLIC_URL}/img/admin/dashboard_match.png`} />
          </div>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryText}>
              <div className={styles.text}>총 매칭 횟수</div>
              <div className={styles.info}>
                <span>{matchingCount.toLocaleString()}</span> 회
              </div>
            </div>
            <hr className={styles.summaryHr} />
          </div>
        </div>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>
            <img src={`${process.env.PUBLIC_URL}/img/admin/dashboard_user.png`} />
          </div>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryText}>
              <div className={styles.text}>총 회원수</div>
              <div className={styles.info}>
                <span>{userCount.toLocaleString()}</span> 명
              </div>
            </div>
            <hr className={styles.summaryHr} />
          </div>
        </div>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>
            <img src={`${process.env.PUBLIC_URL}/img/admin/dashboard_question.png`} />
          </div>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryText}>
              <div className={styles.text}>미확인 문의 내역</div>
              <div className={styles.info}>
                <span>{reportCount}</span>
              </div>
            </div>
            <hr className={styles.summaryHr} />
          </div>
        </div>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>
            <img src={`${process.env.PUBLIC_URL}/img/admin/dashboard_money.png`} />
          </div>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryText}>
              <div className={styles.text}>총 매출액</div>
              <div className={styles.info}>
                &#8361;<span>{totalProfit.toLocaleString()}</span>
              </div>
            </div>
            <hr className={styles.summaryHr} />
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartOuterBox}>
          <div className={`${styles.chart} ${styles.chartPrice}`}>
            <PriceChart />
          </div>
          <div className={styles.chartDescription}>
            <div className={styles.descriptionContainer}>
              <div className={styles.descriptionTitle}>
                <span style={{ fontSize: "23px", fontWeight: "600", color: "#393939" }}>서비스 매출액 추이</span>
              </div>
              <hr style={{ width: "550px" }} />
              <div>
                <img src={`${process.env.PUBLIC_URL}/img/admin/image25.png`} width="20px" />
                <span className={styles.updateTime}> updated for 3 minutes age..</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.chartOuterBox}>
          <div className={`${styles.chart} ${styles.chartMatching}`}>
            <MatchingChart />
          </div>
          <div className={styles.chartDescription}>
            <div className={styles.descriptionContainer}>
              <div className={styles.descriptionTitle}>
                <span style={{ fontSize: "23px", fontWeight: "600", color: "#393939" }}>매칭 성공 추이</span>
              </div>
              <hr style={{ width: "550px" }} />
              <div>
                <img src={`${process.env.PUBLIC_URL}/img/admin/image25.png`} width="20px" />
                <span className={styles.updateTime}> updated for 3 minutes age..</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import styles from "./Dashboard.module.css";
import { PriceChart } from "./PriceChart";
import { MatchingChart } from "./MatchingChart";

const Dashboard = () => {
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
                <span>4,819</span> 회
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
                <span>2,891</span> 명
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
                <span>27</span>
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
                &#8361;<span>203,102,000</span>
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
          <div className={styles.chartDescription}></div>
        </div>
        <div className={styles.chartOuterBox}>
          <div className={`${styles.chart} ${styles.chartMatching}`}>
            <MatchingChart />
          </div>
          <div className={styles.chartDescription}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

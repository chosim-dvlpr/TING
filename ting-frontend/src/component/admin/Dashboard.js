import styles from "./Dashboard.module.css";

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
            <img src={`${process.env.PUBLIC_URL}/img/admin/dashboard_question.png`} />
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
            <img src={`${process.env.PUBLIC_URL}/img/admin/dashboard_money.png`} />
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
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartOuterBox}>
          <div className={styles.chart}> </div>
          <div className={styles.chartDescription}></div>
        </div>
        <div className={styles.chartOuterBox}>
          <div className={styles.chart}> </div>
          <div className={styles.chartDescription}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

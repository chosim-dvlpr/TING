import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div>
      <div>대시보드 입니다.</div>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>사진</div>
          <div className={styles.summaryInfo}>정보 컴포넌트</div>
        </div>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>사진</div>
          <div className={styles.summaryInfo}>정보 컴포넌트</div>
        </div>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>사진</div>
          <div className={styles.summaryInfo}>정보 컴포넌트</div>
        </div>
        <div className={styles.summaryBox}>
          <div className={styles.summaryIcon}>사진</div>
          <div className={styles.summaryInfo}>정보 컴포넌트</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

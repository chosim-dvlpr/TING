import { Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.adminContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img src="/img/ting_logo_fish.png" alt="로고" width="70px" />
          <span>ADMIN</span>
          <hr />
        </div>
        <div className={styles.sidebarMenu}>
          <div onClick={() => navigate("/admin/dashboard")}>Dashboard</div>
          <div>Report</div>
          <div>User</div>
          <div>Q&A</div>
        </div>
      </div>
      <Outlet></Outlet>
    </div>
  );
}

export default AdminPage;

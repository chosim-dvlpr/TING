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
        </div>
        <hr style={{ margin: "0 auto" }} width="200px" />
        <div className={styles.sidebarMenu}>
          <div className={styles.sideList} onClick={() => navigate("/admin/dashboard")}>
            <img src={process.env.PUBLIC_URL + "/img/admin/image21.png"} width="30px" />
            Dashboard
          </div>
          <div className={styles.sideList} onClick={() => navigate("/admin/report")}>
            <img src={process.env.PUBLIC_URL + "/img/admin/image22.png"} width="30px" />
            Report
          </div>
          <div className={styles.sideList} onClick={() => navigate("/admin/qna")}>
            <img src={process.env.PUBLIC_URL + "/img/admin/image24.png"} width="30px" />
            Q&A
          </div>
        </div>
      </div>
      <Outlet></Outlet>
    </div>
  );
}

export default AdminPage;

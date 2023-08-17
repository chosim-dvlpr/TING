import { useNavigate } from "react-router-dom";
import styles from "./ItemSideBar.module.css";
import { NavLink } from "react-router-dom";

function ItemSideBar() {
  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBarList}>
        <NavLink
          to="/item/shop"
          className={({ isActive }) => {
            return isActive ? styles.selected : styles.unSelected;
          }}
        >
          아이템 상점
        </NavLink>
      </div>
      <div className={styles.sideBarList}>
        <NavLink
          to="/item/myitem"
          className={({ isActive }) => {
            return isActive ? styles.selected : styles.unSelected;
          }}
        >
          보유 아이템 관리
        </NavLink>
      </div>
      <div className={styles.sideBarList}>
        <NavLink
          to="/item/mypoint"
          className={({ isActive }) => {
            return isActive ? styles.selected : styles.unSelected;
          }}
        >
          포인트 충전 및 관리
        </NavLink>
      </div>
    </div>
  );
}

export default ItemSideBar;

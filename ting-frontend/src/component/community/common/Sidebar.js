import React from "react";

import styles from "./Sidebar.module.css";

import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <aside>
        <ul>
          <li>
            <NavLink
              to="/community/issue"
              className={({ isActive }) => {
                return isActive ? styles.selected : styles.noSelected;
              }}
            >
              VS 논쟁
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/community/advice"
              className={({ isActive }) => {
                return isActive ? styles.selected : styles.noSelected;
              }}
            >
              연애 상담
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;

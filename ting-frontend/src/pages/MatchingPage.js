import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetMatchingStore } from "../redux/matchingStore";

import styles from "./MatchingPage.module.css";

function MatchingPage() {
  let dispatch = useDispatch();

  useEffect(() => {
    console.log("MatchingPage");
    return () => {
      // 초기화 하는 로직 작성
      console.log("redux 데이터 초기화");
      dispatch(resetMatchingStore());
    };
  }, []);

  return (
    <div className={styles.matchingBackground}>
      <div className={styles.matchingContainer}>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default MatchingPage;

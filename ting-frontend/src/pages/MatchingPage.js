import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetMatchingStore } from "../redux/matchingStore";

import styles from "./MatchingPage.module.css";

import FishAnimation from "../component/matching/Fish.js"

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
      <FishAnimation/>
      <div className={styles.matchingContainer}>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default MatchingPage;

import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOpenviduSession, setQuestionData, setQuestionNumber, setMatchingId, setMyScore, setYourScore, setYourData } from "../redux/matchingStore";

function MatchingPage() {
  let dispatch = useDispatch();

  useEffect(() => {
    console.log("MatchingPage");
    return () => {
      // 초기화 하는 로직 작성
      console.log("redux 데이터 초기화");
      dispatch(setOpenviduSession(null));
      dispatch(setQuestionData({}));
      dispatch(setQuestionNumber(0));
      dispatch(setMatchingId(null));
      dispatch(setMyScore([]));
      dispatch(setYourScore([]));
      dispatch(setYourData({}));
    };
  }, []);

  return (
    <div>
      <h1>매칭</h1>
      <Outlet></Outlet>
    </div>
  );
}

export default MatchingPage;

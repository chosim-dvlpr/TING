import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionNumber } from "../../../redux/matchingStore";
import { setMyScore } from "../../../redux/matchingStore"


function TimerBar(props) {
  let [count, setCount] = useState(30); // 처음 인사는 10초
  let [questionCount, setQuestionCount] = useState(0); 
  let [startTimer, setStartTimer] = useState(false)

  const dispatch = useDispatch();

  const questionNumber = useSelector((state) => state.matchingReducer.questionNumber);
  const openviduSession = useSelector((state) => state.matchingReducer.openviduSession);
  const myScore = useSelector((state) => state.matchingReducer.myScore);

  // 질문카드가 변경되었을떄

  useEffect(() => {

    const timer = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);

    if (questionNumber === 0 && startTimer == false) {
      setCount(10)
      setStartTimer(true)
    }

    if (count === -1) {
      clearInterval(timer);
      // 타이머 끝났다는 신호 줌
      console.log("타이머끝낫어!");
      setCount(30)
      // 타임이 끝나면 5점을 자동으로 상대에게 전달
      openviduSession.signal({
        data: JSON.stringify({ score: 5 }),
        to: [],
        type: "score",
      });

      // TODO: myScore에 5점 추가하는 로직
      dispatch(setMyScore(5))
      dispatch(setQuestionNumber(questionNumber+1))
      
      // TODO: API로 점수 저장하는 로직
    }
    return () => {
      clearInterval(timer);
    };
  }, [count]);

  useEffect(()=>{
    if (questionNumber === 11){
      setCount(5)
    }
  }, [questionNumber])

  return <h3>{count}</h3>;

}

export default TimerBar;

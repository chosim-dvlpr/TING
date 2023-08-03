import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setQuestionNumber } from "../../../redux/matchingStore";

function TimerBar(){
  let [count, setCount] = useState(10); // 처음 인사는 10초
  let [questionCount, setQuestionCount] = useState(0);
  let dispatch = useDispatch()

  useEffect(()=>{{

    const timer = setInterval(()=>{
      setCount((count) => count-1);
    }, 1000);

    if (count === -1){
      // 타이머 정지
      clearInterval(timer);
      // 타이머 반복
      setCount(30)
      // TODO: 질문 카드 변경
      setQuestionCount(questionCount+1)
      console.log(questionCount+1)
      dispatch(setQuestionNumber(questionCount+1))

    }
    return () => {clearInterval(timer);}
  }},[count])
  
  return <h3>{ count }</h3>;
}

export default TimerBar
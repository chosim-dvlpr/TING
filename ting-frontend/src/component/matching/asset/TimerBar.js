import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setQuestionNumber } from "../../../redux/matchingStore";

function TimerBar(props){
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
      // 타이머 끝났다는 신호 줌
      console.log('타이머끝낫어!')
      props.setTimerResetSign(true)
      console.log(props.timerResetSign)
    }
    return () => {clearInterval(timer);}
  }},[count])
  
  return <h3>{ count }</h3>;
}

export default TimerBar
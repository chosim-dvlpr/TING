import { useEffect, useState } from "react"
import styles from "./MatchingChoice.js"
import { useSelector } from "react-redux/es/hooks/useSelector"

function MatchingChoice({session, count}){
  const state = useSelector((state)=>state.matchingReducer)
  const yourData = state.yourData
  const matchingResult = state.matchingResult
  const [finish, setFinish] = useState(false) 
  const [result,setResult] = useState(false)

  useEffect(()=>{
    if (count === 0){
      setFinish(true)
      sendResult(result)
    }
  },[count]);

  // 상대에게 최종 결과를 전송하는 로직
  const sendResult = (result) => {
    session.signal({
      data:JSON.stringify({ result : result }),
      to:[],
      type:"select",
    })
  }


  return(
    <div className={styles.Container}>
      <div classNave={styles.InnerBox}>
        <h1>최종 선택</h1>
        { finish ? (
          matchingResult ? ( 
            <div>
              <h3>{yourData.nickname}님이 수락하셨습니다.</h3>
              <h3>자동으로 어항에 추가됩니다.</h3>
              <button>메인으로 돌아가기</button>
            </div>
          ) : (
            <div>
              <h3>{yourData.nickname}님이 거절하셨습니다.</h3>
              <h3>다음 기회에....</h3>
              <button>메인으로 돌아가기</button>
            </div>
          )
        ) : (
        <div>
          <h3>{yourData.nickname}님을 선택하시겠습니까?</h3>
          <h3>{ count }</h3>
          <button onClick={()=>{setResult(true)}}>YES</button>
          <button onClick={()=>{setResult(false)}}>NO</button>
        </div>)
        }
      </div>
    </div>
  )
}
export default MatchingChoice
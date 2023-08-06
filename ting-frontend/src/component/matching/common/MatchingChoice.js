import { useEffect, useState } from "react"
import styles from "./MatchingChoice.js"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { useNavigate } from "react-router-dom"

function MatchingChoice({session, count}){
  const navigate = useNavigate()

  const state = useSelector((state)=>state)
  const yourData = state.matchingReducer.yourData
  const userData = state.userdataReducer.userdata
  const matchingResult = state.matchingReducer.matchingResult
  
  const [finish, setFinish] = useState(false) 
  const [result,setResult] = useState(false)

  // 최종 선택 타이머 끝내는 로직
  useEffect(()=>{
    if (count === 0){
      setFinish(true)
    }
  },[count]);

  // 결과 선택 로직
  useEffect(()=>{
    sendResult(result)
  },[result])

  // 상대에게 최종 결과를 전송하는 로직
  const sendResult = (result) => {
    session.signal({
      data:JSON.stringify({ result : result, userId : userData.userId }),
      to:[],
      type:"select",
    })
  }


  return(
    <div className={styles.Container}>
      <div classNave={styles.InnerBox}>
        <h1>최종 선택</h1>
        { finish ? (
          matchingResult.result ? ( 
            <div>
              <h3>{yourData.nickname}님이 수락하셨습니다.</h3>
              <h3>자동으로 어항에 추가됩니다.</h3>
              <button onClick={()=>{navigate("/")}}>메인으로 돌아가기</button>
            </div>
          ) : (
            <div>
              <h3>{yourData.nickname}님이 거절하셨습니다.</h3>
              <h3>다음 기회에....</h3>
              <button onClick={()=>{navigate("/")}}>메인으로 돌아가기</button>
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
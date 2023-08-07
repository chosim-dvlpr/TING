import { useEffect, useState } from "react"
import styles from "./MatchingChoice.js"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { useNavigate } from "react-router-dom"
import tokenHttp from "../../../api/tokenHttp.js"

function MatchingChoice({session, count}){
  const navigate = useNavigate()

  const state = useSelector((state)=>state)
  const yourData = state.matchingReducer.yourData
  const userData = state.userdataReducer.userdata
  const matchingId = state.matchingReducer.matchingId
  const matchingResult = state.matchingReducer.matchingResult
  
  const [finish, setFinish] = useState(false) 
  const [result,setResult] = useState(false)

  // 최종 선택 타이머 끝내는 로직
  useEffect(()=>{
    if (count === 0){
      setFinish(true)
      becomeFriend()
    }
  },[count]);

  // 결과 선택 로직
  useEffect(()=>{
    sendResult(result)
  },[result])

  // 최종 결과 비동기로 친구 매칭 보내는 함수
  const becomeFriend = async ()=>{
    let resultData;
    if (result) {
      resultData={
        matchingId: matchingId,
        choice : 'yes'
      };
    } else {
      resultData={
        matchingId: matchingId,
        choice : 'no'
      };
    }
    try {
      const response = await tokenHttp.post('/date/result',resultData)
      console.log(response.data);
    } catch(err) {
      console.log(err)
    }
  }

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
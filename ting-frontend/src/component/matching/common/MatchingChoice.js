import { useEffect, useState } from "react"
import styles from "./MatchingChoice.module.css"
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
  const [matchingFinish, setMatchingFinish] = useState(false)

  // 최종 선택 타이머 끝내는 로직
  useEffect(()=>{
    if (count === 0 && !matchingFinish){
      setFinish(true)
      setMatchingFinish(true)
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
    <>
      <div className={styles.OuterContainer}>
        <h1>최종 선택</h1>  
      </div>
    
      <div className={styles.Container}>

        {/* 자신의 카드 */}
        <div className={styles.flip}>  
          <div className={`${styles.card}`} >
            {/* 앞면 */}
            <div className={styles.front}></div>
            {/* 뒷면 */}
            <div className={styles.back}>
              <p className={styles.CardContent}>{ result ? 'YES':'NO' }</p>
            </div>
          </div>
        </div>

        <div className={styles.InnerBox}>
          
          { finish ? (
            <div>
              <h3>모두 YES일 경우</h3>
              <h3>자동으로 어항에 추가됩니다.</h3>
              <button onClick={()=>{navigate("/")}}>메인으로 돌아가기</button>
            </div>
          ) : (
          <div>
            <h3>{yourData.nickname}님을 선택하시겠습니까?</h3>
            <h3>{ count }</h3>
            <button onClick={()=>{setResult(true);}}>YES</button>
            <button onClick={()=>{setResult(false)}}>NO</button>
          </div>)
          }
        </div>
        
        {/* 상대의 카드 */}
        {finish ? (
          <div className={styles.flip}>  
            <div className={`${styles.card}`} >
              {/* 앞면 */}
              <div className={styles.yourFront}></div>
              {/* 뒷면 */}
              <div className={styles.back}>
                <p className={styles.CardContent}>{ matchingResult.result ? 'YES':'NO' }</p>
              </div>
            </div>
          </div>
        ) : (null)}

      </div>
    </>
  )
}
export default MatchingChoice
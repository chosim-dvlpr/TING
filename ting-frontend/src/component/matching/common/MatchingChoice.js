import { useEffect, useState } from "react"
import styles from "./MatchingChoice.module.css"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { useNavigate } from "react-router-dom"
import tokenHttp from "../../../api/tokenHttp.js"
import MatchingResult from "./MatchingResult"

function MatchingChoice({ session, count }) {
  const navigate = useNavigate()
  const [isFlipped, setIsFlipped] = useState(false)

  const state = useSelector((state) => state)
  const yourData = state.matchingReducer.yourData
  const userData = state.userdataReducer.userdata
  const matchingId = state.matchingReducer.matchingId
  const matchingResult = state.matchingReducer.matchingResult

  const [finish, setFinish] = useState(false)
  const [result, setResult] = useState(false)
  const [matchingFinish, setMatchingFinish] = useState(false)
  const [buttonToggleSign, setButtonToggleSign] = useState([false, false])
  const [afterFirstClick, setAfterFirstClick] = useState(false)

  // 최종 선택 타이머 끝내는 로직
  useEffect(() => {
    if (count === 0 && !matchingFinish) {
      setFinish(true)
      setMatchingFinish(true)
      becomeFriend()
    }
  }, [count]);

  // 결과 선택 로직
  useEffect(() => {
    // 결과 선택 저장
    sendResult(result)
    // 버튼 토글
    if (result) {
      setButtonToggleSign([true, false])
    }
    else {
      setButtonToggleSign([false, true])
    }

  }, [result])

  // 최종 결과 비동기로 친구 매칭 보내는 함수
  const becomeFriend = async () => {
    let resultData;
    if (result) {
      resultData = {
        matchingId: matchingId,
        choice: "yes"
      };
    } else {
      resultData = {
        matchingId: matchingId,
        choice: "no"
      };
    }
    try {
      console.log('여기가 문제네?')
      const response = await tokenHttp.post('/date/result', resultData)
      console.log('친구 추가 되었는지에 대한 데이터',response.data);
      
    } catch (err) {
      console.log(err)
    }
  }

  // 상대에게 최종 결과를 전송하는 로직
  const sendResult = (result) => {
    if (session) {
      session.signal({
        data: JSON.stringify({ result: result, userId: userData.userId }),
        to: [],
        type: "select",
      })
    }
  }

  // 클릭시 뒤집어져서 결과 확인
  const flipCard = (event) => {
    setIsFlipped(!isFlipped)
  }


  return (
    <>
      {/* 최종 결과 */}
      {finish ? <MatchingResult result={result}/> : null}

      <div className={styles.OuterContainer}>
        <h1>최종 선택</h1>
      </div>

      <div className={styles.Container}>

        {/* 자신의 카드 */}
        <div className={styles.flip}>
          <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`} >
            {/* 앞면 */}
            {afterFirstClick ? (
              <div className={styles.front2}>
                <p className={styles.CardContent}>{result ? 'YES' : 'NO'}</p>
              </div>
            ) : (
              // 첫 클릭일 때
              <div className={styles.front}></div>
            )}

            {/* 뒷면 */}
            <div className={styles.back}>
              <p className={styles.CardContent}>{result ? 'YES' : 'NO'}</p>
            </div>
          </div>
        </div>

        <div className={styles.InnerBox}>
          <div>
            <h3>{yourData.nickname}님을 선택하시겠습니까?</h3>
            <h3>{count}</h3>
            <button
              className={`styles.Btn ${buttonToggleSign[0] ? styles.clickedButton : styles.button}`}
              onClick={() => {
                setResult(true);
                flipCard();
                setAfterFirstClick(true);
              }}
            >YES</button>
            <button
              className={`styles.Btn ${buttonToggleSign[1] ? styles.clickedButton : styles.button}`}
              onClick={() => {
                setResult(false);
                flipCard();
                setAfterFirstClick(true);
              }}
            >NO</button>
          </div>
        </div>
      </div>
    </>
  )
}
export default MatchingChoice
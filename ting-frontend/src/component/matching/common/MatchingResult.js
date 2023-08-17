import { useEffect, useState } from "react"
import Confetti from 'react-confetti'
import styles from "./MatchingResult.module.css"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { useNavigate } from "react-router-dom"
import { resetMatchingStore } from "../../../redux/matchingStore"

import tokenHttp from "../../../api/tokenHttp.js"
import { useDispatch } from "react-redux"

function MatchingResult({ session, count, result }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isFlipped, setIsFlipped] = useState(false)
  const [sendedResult,setSendedResult] = useState(result)

  const state = useSelector((state) => state)
  const yourData = state.matchingReducer.yourData
  const userData = state.userdataReducer.userdata
  const matchingId = state.matchingReducer.matchingId
  const matchingResult = state.matchingReducer.matchingResult

  const [lastResultSign, setLastResultSign] =useState(false)

  // 클릭시 뒤집어져서 결과 확인
  const flipCard = (event) => {
    setIsFlipped(true)
    // 결과 확인 누른거 sign 보내기
  }

  const checkLastResult = () => {
    setLastResultSign(true)
  }

  // 언마운트 때 초기화
  useEffect(() => {
    return () => {
      dispatch(resetMatchingStore())
    }
  }, [])

  return (
    <>
      <div className={styles.ConfettiOuter}>
        {matchingResult && sendedResult && isFlipped ? <Confetti className={styles.Confetti} /> : null}
      </div>
      <div className={styles.OuterContainer}>
        <h1>최종 결과</h1>
      </div>

      <div className={styles.Container}>

        {/* 자신의 카드 */}
        <div className={styles.flip}>
          <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`} >
            {/* 앞면 */}
            <div className={styles.front}></div>
            {/* 뒷면 */}
            <div className={styles.back}>
              <p className={styles.CardContent}>{sendedResult ? 'YES' : 'NO'}</p>
            </div>
          </div>
        </div>

        <div className={styles.InnerBox}>
          { lastResultSign ? (
            <>
              { matchingResult ? (
                <>
                  <h3>축하합니다!</h3>
                  <h3>어항에 {yourData.nickname} 님이 추가되었습니다.</h3>
                  <button className={styles.lastResultButton} onClick={() => { window.location.href = '/'; }}>메인으로 돌아가기</button>
                </>
              ):(
                <>
                  <h3>{yourData.nickname} 님이 도망가셨습니다.</h3>
                  <button className={styles.lastResultButton} onClick={() => { window.location.href = '/'; }}>메인으로 돌아가기</button>
                </>
              )}
            </>
          ):(
            <>
              <h3>결과 확인</h3>
              <button className={styles.lastResultButton} onClick={() => { flipCard(); checkLastResult(); }}>결과 확인하기</button>
            </>
          )}
        </div>

        {/* 상대의 카드 */}
        <div className={styles.flip}>
          <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`} >
            {/* 앞면 */}
            <div className={styles.yourFront}></div>
            {/* 뒷면 */}
            <div className={styles.back}>
              <p className={styles.CardContent}>{matchingResult ? 'YES' : 'NO'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default MatchingResult
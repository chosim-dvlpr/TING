import { useEffect, useState } from "react"
import styles from "./MatchingResult.module.css"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { useNavigate } from "react-router-dom"
import tokenHttp from "../../../api/tokenHttp.js"

function MatchingResult({ session, count, result }) {
  const navigate = useNavigate()
  const [isFlipped, setIsFlipped] = useState(false)

  const state = useSelector((state) => state)
  const yourData = state.matchingReducer.yourData
  const userData = state.userdataReducer.userdata
  const matchingId = state.matchingReducer.matchingId
  const matchingResult = state.matchingReducer.matchingResult

  // 클릭시 뒤집어져서 결과 확인
  const flipCard = (event) => {
    setIsFlipped(!isFlipped)
    // 결과 확인 누른거 sign 보내기
  }

  return (
    <>
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
              <p className={styles.CardContent}>{result ? 'YES' : 'NO'}</p>
            </div>
          </div>
        </div>

        <div className={styles.InnerBox}>
          <div>
            <h3>모두 YES일 경우</h3>
            <h3>자동으로 어항에 추가됩니다.</h3>
            <button onClick={() => { flipCard() }}>결과 확인하기</button>
            <button className={styles.lastResultButton} onClick={() => { window.location.href = '/' }}>메인으로 돌아가기</button>
          </div>
        </div>

        {/* 상대의 카드 */}
        <div className={styles.flip}>
          <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`} >
            {/* 앞면 */}
            <div className={styles.yourFront}></div>
            {/* 뒷면 */}
            <div className={styles.back}>
              <p className={styles.CardContent}>{matchingResult.result ? 'YES' : 'NO'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default MatchingResult
import { useEffect, useState } from 'react';
import styles from './ScoreCheck.module.css';
import TimerBar from './TimerBar.js'

function ScoreCheck(){
  const score = [0,1,2,3,4,5,6,7,8,9,10]

  return(
    <div className='wrapper'>
      <div className={styles.ScoreCheckBox}>
        <div>
          <TimerBar 
            totalTime={30000} 
          />
        </div>
        <div className={styles.ScoreBox}>
        {
          score.map(function(score,i){
            return (
              <HeartScore 
                key={i} 
                score={score} 
                // timerResetSign={timerResetSign}
                // setTimerResetSign={setTimerResetSign}
              ></HeartScore>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function HeartScore(props){
  
  let [buttonToggleSign,setButtonToggleSign] = useState(false)
  
  // useEffect 로 questionNumber 가 바뀌면 토글을 풀어야 함

  useEffect(()=>{
    console.log('여기 버튼 초기화해!', props.score)
    if (props.timerResetSign){
      setButtonToggleSign(false)
    }
    props.setTimerResetSign(false)
    // console.log('buttontoggle',buttonToggleSign)
    // console.log('timerreset',props.timerResetSign)
  },[props.timerResetSign])


  // 점수 클릭시 발생하는 이벤트
  const handleScoreSelect = () => {
    // TODO: 점수를 서버로 전송하는 로직

    // TODO: myScore에 추가하는 로직

    // TODO: 상대에게 점수를 전송하는 로직 (openviduSession.signal)
    
    // TODO: 선택이 불가능하도록 state 변경
  }

  return (
    <div className={styles.HeartScore}>
        <img 
          src={buttonToggleSign ? "/img/heart-icon-toggle.png" : "/img/heart-icon.png" } 
          id= {`buttonImg-${props.score}`}
        />
        <div 
          className={styles.ScoreText} 
          onClick={()=>{
            setButtonToggleSign(!buttonToggleSign);
            handleScoreSelect();
          }}
        >
          {props.score}
        </div>
    </div>
  )
}


export default ScoreCheck
import { useEffect, useState } from 'react';
import styles from './ScoreCheck.module.css';
import TimerBar from './TimerBar.js'

function ScoreCheck(){
  const score = [0,1,2,3,4,5,6,7,8,9,10]
  let [timerResetSign, setTimerResetSign] = useState(false) 

  return(
    <div className='wrapper'>
      <div className={styles.ScoreCheckBox}>
        <div>
          <TimerBar 
            totalTime={30000} 
            timerResetSign={timerResetSign}
            setTimerResetSign={setTimerResetSign} 
          />
        </div>
        <div className={styles.ScoreBox}>
        {
          score.map(function(score,i){
            return (
              <HeartScore 
                key={i} 
                score={score} 
                timerResetSign={timerResetSign}
                setTimerResetSign={setTimerResetSign}
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
  
  useEffect(()=>{
    console.log('여기 버튼 초기화해!', props.score)
    if (props.timerResetSign){
      setButtonToggleSign(false)
    }
    props.setTimerResetSign(false)
    // console.log('buttontoggle',buttonToggleSign)
    // console.log('timerreset',props.timerResetSign)
  },[props.timerResetSign])

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
          }}
        >
          {props.score}
        </div>
    </div>
  )
}


export default ScoreCheck
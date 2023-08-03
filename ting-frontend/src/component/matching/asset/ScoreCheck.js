import styles from './ScoreCheck.module.css';
import TimerBar from './TimerBar.js'

function ScoreCheck(){
  const score = [0,1,2,3,4,5,6,7,8,9,10]

  return(
    <div className='wrapper'>
      <div className={styles.ScoreCheckBox}>
        <div>
          <TimerBar totalTime={30000} />
        </div>
        <div className={styles.ScoreBox}>
        {
          score.map(function(score,i){
            return (
              <HeartScore key={i} score={score}></HeartScore>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function HeartScore(props){
  return (
    <div className={styles.HeartScore}>
      <button>
        <img src="/img/heart-icon.png" />
        <div className={styles.ScoreText}>
          {props.score}
        </div>
      </button>
    </div>
  )
}


export default ScoreCheck
import styles from './ScoreCheck.module.css';

function ScoreCheck(){
  const score = [0,1,2,3,4,5,6,7,8,9,10]

  return(
    <div className='wrapper'>
      <div className={styles.ScoreCheckBox}>
        <div>
          시간 줄어드는 바
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
      <img src="/img/heart-icon.png" />
      <div className={styles.ScoreText}>
        {props.score}
      </div>
    </div>
  )
}


export default ScoreCheck
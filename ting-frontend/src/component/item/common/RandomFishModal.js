import React from 'react'
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import styles from './RandomFishModal.module.css'



function RandomFishModal({ randomFishData, closeModal }) {

  return (
    <>
      <Confetti className={styles.Confetti}/>
      <div className={styles.RandomFishModalInner}>
        <img src={`${process.env.PUBLIC_URL}/img/closeIcon.png`} className={styles.closeButton} onClick={() => { closeModal() }} />
        <h3>새로운 물고기 등장</h3>
        <img src={`https://i9b107.p.ssafy.io:5157/${randomFishData}`} className={styles.fishImg} />
      </div>
    </>
  )
}

export default RandomFishModal
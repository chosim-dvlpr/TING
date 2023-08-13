import styles from './RandomFishModal.module.css'

function RandomFishModal({ randomFishData, closeModal }) {

  const debrisCoordinates = [
    { dx: -0.5, dy: -0.5, scale: 1 },
    { dx: 0.5, dy: 0.5, scale:1 },
    { dx: 0.2, dy: -0.6, scale:1 },
    { dx: -0.8, dy: 0.2, scale:1 },
    { dx: -0.3, dy: 0.6, scale:1 },
    { dx: 0.6, dy: -0.3, scale:1 },
    { dx: 0.7, dy: 0, scale:1 },
    { dx: -0.7, dy: 0, scale:1 },
    { dx: 0, dy: 0.7, scale:1 },
    { dx: 0, dy: -0.7, scale:1 },
  ];

  return (
    <>
      <div className={styles.RandomFishModalInner}>
        <img src={`${process.env.PUBLIC_URL}/img/closeIcon.png`} className={styles.closeButton} onClick={() => { closeModal() }} />
        <h1>당신의 새로운 물고기</h1>
        <img src={`https://i9b107.p.ssafy.io:5157/${randomFishData}`} className={styles.fishImg} />
        {debrisCoordinates.map((coords, index) => (
          <div
            key={index}
            className={styles.fishDebris}
            style={{ "--dx": coords.dx, "--dy": coords.dy, "--scale": coords.scale, animationDelay: "0.5s" }}
          ></div>
        ))}
      </div>
    </>
  )
}

export default RandomFishModal
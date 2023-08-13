import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./ItemUseModal.module.css";

import tokenHttp from "../../../api/tokenHttp";

function ItemModal({ closeModal, clickedItem }) {

  // 모달 관련 state
  const [randomFishModalSign, setRandomFishModalSign] = useState(false)

  // 물고기 스킨 관련 state
  const [randomFishData, setRandomFishData] = useState('')

  const closeRandomModal = () => {
    setRandomFishModalSign(false)
  }

  const getRandomFish = () => {
    if (clickedItem.name === "물고기 스킨 랜덤박스") {
      tokenHttp.put('/item/fishRandomBox')
        .then(response => {
          // 랜덤 피쉬 모달을 띄워줌
          setRandomFishModalSign(true)
          setRandomFishData(response.data.data.imagePath)
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <div>
      <div
        className={styles.ModalOuter}
        onClick={() => {
          closeModal();
        }}
      ></div>
      <div className={styles.ModalInner}>
      <img src={`${process.env.PUBLIC_URL}/img/closeIcon.png`} className={styles.closeButton} onClick={() => { closeModal() }} />
        <div className={styles.image}>
          <img src={clickedItem.img} />
        </div>
        <h2>{clickedItem.name}</h2>
        <div className={styles.description}>{clickedItem.description}</div>

        {/* 사용하기 버튼 */}
        <div>
          <div
            className={styles.button}
            onClick={() => {
              getRandomFish()
              // 여기에 아이템 사용 axios 호출
            }}
          >
            사용하기
          </div>
        </div>
      </div>

      {randomFishModalSign ?
        <div>
          <RandomFishModal randomFishData={randomFishData} closeModal={closeModal} />
        </div>
        : null}

    </div>
  );

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

}

export default ItemModal;

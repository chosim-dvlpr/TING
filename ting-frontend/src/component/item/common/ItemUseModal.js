import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./ItemUseModal.module.css";

import RandomFishModal from "./RandomFishModal";

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


  

}

export default ItemModal;

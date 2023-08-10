import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./ItemModal.module.css";

import tokenHttp from "../../../api/tokenHttp";

function ItemModal({ closeModal, clickedItem }) {
  const [quantity, setQuantity] = useState(1);

  const changeQuantity = (sign) => {
    if (sign === "-") {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    } else {
      setQuantity(quantity + 1);
    }
  };

  const buyItem = () => {
    console.log(clickedItem.code);
    console.log(quantity);
    tokenHttp
      .get(`/item/${clickedItem.code}/${quantity}`)
      .then((response) => {
        if (response.data.code == 200) {
          alert("아이템 구매를 완료하였습니다.");
          closeModal();
        } else if (response.data.code == 4970) {
          alert("포인트가 부족합니다.");
        } else {
          console.log(response.data);
          alert("아이템 구매 중 오류가 발생하였습니다.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div
        className={styles.ModalOuter}
        onClick={() => {
          closeModal();
        }}
      ></div>
      <div className={styles.ModalInner}>
        <div className={styles.image}>
          <img src={clickedItem.img} />
        </div>
        <h2>{clickedItem.name}</h2>
        <h4>{clickedItem.content}</h4>
        {/* 개수 체크 버튼 */}
        <div className={styles.QuantityBox}>
          <div
            className={styles.MinusButton}
            onClick={() => {
              changeQuantity("-");
            }}
          >
            -
          </div>
          <div className={styles.QuantityNum}>{quantity}</div>
          <div
            className={styles.PlusButton}
            onClick={() => {
              changeQuantity("+");
            }}
          >
            +
          </div>
        </div>
        <div className={styles.priceDiv}>
          <img
            src={process.env.PUBLIC_URL + "/img/coin.png"}
            className={styles.coinImage}
            alt="coin"
          ></img>
          {clickedItem.price}
        </div>
        {/* 구매하기 버튼 */}
        <div>
          <div
            className={styles.button}
            onClick={() => {
              buyItem();
            }}
          >
            구매하기
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;

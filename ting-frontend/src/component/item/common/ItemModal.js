import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ItemModal.module.css";

import tokenHttp from "../../../api/tokenHttp";

import Swal from "sweetalert2";

function ItemModal({ closeModal, clickedItem }) {
  const [quantity, setQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(clickedItem.price);
  const priceRef = useRef();
  const navigate = useNavigate();

  const changeQuantity = (sign) => {
    if (sign === "-") {
      if (quantity > 1) {
        setQuantity(quantity - 1);
        setItemPrice(clickedItem.price * (quantity - 1));
        priceRef.current.innerHTML = itemPrice;
      }
    } else {
      setQuantity(quantity + 1);
      setItemPrice(clickedItem.price * (quantity + 1));
      priceRef.current.innerHTML = itemPrice;
    }
  };

  const buyItem = () => {
    // console.log(clickedItem.code);
    // console.log(quantity);
    tokenHttp
      .get(`/item/${clickedItem.code}/${quantity}`)
      .then((response) => {
        console.log(response.data.code);
        if (response.data.code == 200) {
          Swal.fire("아이템 구매를 완료하였습니다.");
          closeModal();
          navigate("/item/shop");
        }
      })
      .catch((err) => {
        if (err.response.data.code === 4970) {
          Swal.fire("포인트가 부족합니다.");
          closeModal();
        } else if (err.response.data.code === 4977) {
          Swal.fire("이미 더 큰 어항을 보유하고 있습니다.");
          closeModal();
        } else {
          Swal.fire("아이템 구매 중 오류가 발생하였습니다.");
          closeModal();
        }
      });
  };

  const addComma = (number) => {
    let returnString = number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
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
        <img
          src={`${process.env.PUBLIC_URL}/img/closeIcon.png`}
          className={styles.closeButton}
          onClick={() => {
            closeModal();
          }}
        />
        <div className={styles.image}>
          <img src={clickedItem.img} />
        </div>
        <h2>{clickedItem.name}</h2>
        <h4>{clickedItem.content}</h4>
        {/* 개수 체크 버튼 */}
        {/* 어항 스킨의 경우 수량 증가,감소 버튼 비활성화 */}
        {clickedItem.name === "작은 어항" ||
        clickedItem.name === "수조" ||
        clickedItem.name === "아쿠아리움" ? (
          <div className={styles.QuantityBox}>
            <div className={styles.noButton}>-</div>
            <div className={styles.QuantityNum}>{quantity}</div>
            <div className={styles.noButton}>+</div>
          </div>
        ) : (
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
        )}
        <div className={styles.priceDiv}>
          <img
            src={process.env.PUBLIC_URL + "/img/coin.png"}
            className={styles.coinImage}
            alt="coin"
          ></img>
          <span ref={priceRef}>{addComma(itemPrice)}</span>
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

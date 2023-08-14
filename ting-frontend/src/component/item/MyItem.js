import React, { useEffect, useState } from "react";
import tokenHttp from "../../api/tokenHttp";
import { useDispatch, useSelector } from "react-redux";
import { setMyItemList } from "../../redux/itemStore";
import styles from "./MyItem.module.css";
import ItemUseModal from "./common/ItemUseModal";

function MyItem() {
  const myItemList = useSelector((state) => state.itemReducer.myItemList);
  const dispatch = useDispatch();
  const [modalSign, setModalSign] = useState(false);
  const [clickedItem, setClickedItem] = useState({});

  const makeItemList = () => {
    tokenHttp
      .get("/item/user")
      .then((response) => {
        if (response.data.code === 200) {
          let myItems = [];
          response.data.data.map((item) => {
            switch (item.name) {
              case "구매한 티켓":
              case "무료 티켓":
                item.img = "/img/item/ticket_heart_one.png";
                break;
              case "물고기 부활 티켓":
                item.img = "/img/item/fish_ticket.png";
                break;
              case "물고기 스킨 랜덤박스":
                item.img = "/img/item/fish_box_2.png";
                break;
              case "닉네임 변경권":
                item.img = "/img/item/ticket_one.png";
                break;
              case "유리병":
                item.img = "/img/item/glass_bottle.png";
                break;
              case "작은 어항":
                item.img = "/img/item/fish_bowl.png";
                break;
              case "수조":
                item.img = "/img/item/fish_tank.png";
                break;
              case "아쿠아리움":
                item.img = "/img/item/aquarium.png";
                break;
            }
            myItems = [...myItems, item];
          });
          dispatch(setMyItemList(myItems));
        } else {
          console.log("보유 아이템을 가져오는데 실패하였습니다.");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    makeItemList();
  }, []);

  // 모달을 여는 함수
  const openModal = (item) => {
    // 모달에 띄울 정보를 보내줌
    setClickedItem(item);
    // 모달을 열어줌
    setModalSign(true);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setModalSign(false);
    makeItemList();
  };

  return (
    <div>
      <div className="container">
        <div className={`row ${styles.ItemCardList}`}>
          {myItemList &&
            myItemList.map((item, idx) => (
              <div
                className={`col-4 ${styles.ItemCardOuter}`}
                onClick={() => {
                  openModal(item);
                }}
              >
                <div key={idx} className={styles.ItemCard}>
                  <div className={styles.ItemCardInside}>
                    <img src={process.env.PUBLIC_URL + item.img}></img>
                  </div>
                  <div className={styles.nameDiv}>{item.name}</div>
                  <div className={styles.quantityDiv}>{item.quantity}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 구매 모달 */}

      {modalSign ? (
        <ItemUseModal closeModal={closeModal} clickedItem={clickedItem} />
      ) : null}
    </div>
  );
}

export default MyItem;

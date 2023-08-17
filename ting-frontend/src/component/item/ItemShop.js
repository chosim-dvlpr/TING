import styles from "./ItemShop.module.css";
import { useState, useEffect } from "react";
import basicHttp from "../../api/basicHttp";

import ItemModal from "./common/ItemModal";
import tokenHttp from "../../api/tokenHttp";

function ItemShop() {
  // 모달 상태 관련
  const [modalSign, setModalSign] = useState(false);
  const [clickedItem, setClickedItem] = useState({});
  const [itemList, setItemList] = useState([]);
  const [itemType, setItemType] = useState("");

  useEffect(() => {
    getIcon();
    getItemList();
  }, [itemType]);

  const getIcon = () => {
    tokenHttp
      .get("/user/skin")
      .then((response) => {
        if (response.data.code == 200) {
          console.log(response.data.data);
          setItemType(response.data.data.itemType);
        } else {
          console.log("아이콘 불러오기 실패");
        }
      })
      .catch(() => {
        console.log("아이콘 불러오기 실패");
      });
  };

  const getItemList = () => {
    basicHttp
      .get("/item")
      .then((response) => {
        if (response.data.code == 200) {
          let items = [];
          response.data.data.map((item) => {
            switch (item.name) {
              case "매칭 티켓":
                item.img = "/img/item/ticket_heart_one.png";
                break;
              case "매칭 티켓 x3":
              case "매칭 티켓 x5":
                item.img = "/img/item/ticket_heart_two.png";
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

            items = [...items, item];
          });
          setItemList(items);
          console.log("========",itemList);
          console.log(items);
        } else {
          console.log("아이템 불러오기 실패");
        }
      })
      .catch(() => {
        console.log("아이템 불러오기 실패");
      });
  };

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
  };

  const addComma = (number) => {
    let returnString = number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
  };

  const checkFish = (item) => {
    if( item.code==7 ) {
      if(itemType=='SKIN_2') return true;
      return false;
    } else if(item.code == 8) {
      if(itemType == 'SKIN_3') return true;
      return false;
    } else if(item.code == 9) {
      if(itemType == 'SKIN_5') return true;
      return false;
    }
    return true;
  }

  return (
    <div>
      <div className={styles.outBox}>
        <div className="container">
          <div className={`row ${styles.ItemCardList}`}>
            {itemList.map((item, idx) => (
              checkFish(item) && (
                <div
                className={`col-4 ${styles.ItemCardOuter}`}
                onClick={() => {
                  openModal(item);
                }}
              >
                <div key={idx} className={styles.ItemCard}>
                  <div className={styles.itemCardInside}>
                    <img src={process.env.PUBLIC_URL + item.img} />
                  </div>
                  <div className={styles.name}>
                    <b>{item.name}</b>
                  </div>
                  <div className={styles.price}>
                    <img
                      src={process.env.PUBLIC_URL + "/img/coin.png"}
                      className={styles.coinImage}
                      alt="coin"
                    ></img>
                    {addComma(item.price)}
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* 구매 모달 */}

      {modalSign ? (
        <ItemModal closeModal={closeModal} clickedItem={clickedItem}/>
      ) : null}
    </div>
  );
}

export default ItemShop;

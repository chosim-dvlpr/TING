import styles from "./ItemShop.module.css"
import { useState } from "react"

import ItemModal from "./common/ItemModal"

function ItemShop() {
  // 모달 상태 관련 
  const [modalSign, setModalSign] = useState(false)
  const [clickedItem, setClickedItem] = useState({})

  // 임시 아이템 데이터
  const ticketItems = [
    { 
      name: '부활 티켓',
      content : '3일이 지나 죽은 물고기를 살릴 수 있습니다',
      price : 1500
    }, 
    { 
      name: '낚시 티켓',
      content : '매칭에 필요한 티켓입니다',
      price : 1500
    }, 
    { 
      name: '닉네임 변경 티켓',
      content : '닉네임을 변경할 수 있는 티켓입니다.',
      price : 1500
    }, 
  ]

  const items =[
    { 
      name: '페트병',
      content : '어항에 3마리까지 담을 수 있습니다.',
      price : 1500
    }, 
    { 
      name: '미니 어항',
      content : '어항에 5마리까지 담을 수 있습니다.',
      price : 1500
    }, 
    { 
      name: '수조',
      content : '어항에 10마리까지 담을 수 있습니다.',
      price : 1500
    }, 
    { 
      name: '대형 수조',
      content : '어항에 20마리까지 담을 수 있습니다.',
      price : 1500
    }, 
    { 
      name: '아쿠아리움',
      content : '어항에 40마리까지 담을 수 있습니다.',
      price : 1500
    }, 
  ]

  // 모달을 여는 함수
  const openModal = (item) => {
    // 모달에 띄울 정보를 보내줌
    setClickedItem(item)
    // 모달을 열어줌
    setModalSign(true)
  }

  // 모달을 닫는 함수
  const closeModal = () => {
    setModalSign(false)
  }

  return(
    <div>
      <div className={styles.outBox}>

      <div>
          <span>티켓</span>
        </div>
        {/* 티켓 아이템 리스트 */}
        <div className="container">
          <div className={`row ${styles.ItemCardList}`}>
            {
              ticketItems.map((ticket,idx)=>(
                <div className={`col-4 ${styles.ItemCardOuter}`} onClick={()=>{openModal(ticket)}}>
                  <div key={idx} className={styles.ItemCard}>
                    <div className={styles.itemCardInside}></div>
                      <div className={styles.name}>{ticket.name}</div>
                      <div className={styles.price}>
                        <img src={process.env.PUBLIC_URL + '/img/coin.png'} className={styles.coinImage} alt="coin"></img>{ticket.price}</div>
                      <div>{ticket.content}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* 아이템 */}
        <div>
          <span>아이템</span>
        </div>

        {/* 아이템 리스트 */}
        <div className="container">
          <div className={`row ${styles.ItemCardList}`}>
            {
              items.map((item,idx)=>(
                <div className={`col-4 ${styles.ItemCardOuter}`} onClick={()=>{openModal(item)}}>
                  <div key={idx} className={styles.ItemCard}>
                    <div className={styles.itemCardInside}></div>
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.price}>
                    <img src={process.env.PUBLIC_URL + '/img/coin.png'} className={styles.coinImage} alt="coin"></img>{item.price}</div>
                    <div>{item.content}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* 구매 모달 */}

      {
        modalSign ? <ItemModal closeModal={closeModal} clickedItem={clickedItem}/> : null
      }
    </div>
  )
}

export default ItemShop
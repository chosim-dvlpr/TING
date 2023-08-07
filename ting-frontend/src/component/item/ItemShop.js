import styles from "./ItemShop.module.css"

function ItemShop() {
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
      name: '무언가 티켓',
      content : '아직 정해지지 않은 티켓입니다.',
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

  return(
    <div className={styles.outBox}>
      <h1>아이템샵</h1>
      {/* 티켓 제목 */}
      <div>
        <span>티켓</span>
      </div>

      {/* 티켓 아이템 리스트 */}
      <div className="container">
        <div className={`row ${styles.ItemCardList}`}>
          {
            ticketItems.map((ticket,idx)=>(
              <div className={`col-4 ${styles.ItemCardOuter}`}>
                <div key={idx} className={styles.ItemCard}>
                  <div>{ticket.name}</div>
                  <div>{ticket.content}</div>
                  <div>{ticket.price}</div>
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
              <div className={`col-4 ${styles.ItemCardOuter}`}>
                <div key={idx} className={styles.ItemCard}>
                  <div>{item.name}</div>
                  <div>{item.content}</div>
                  <div>{item.price}</div>
                </div>
              </div>
            ))
          }
        </div>

      </div>

    </div>
  )
}

export default ItemShop
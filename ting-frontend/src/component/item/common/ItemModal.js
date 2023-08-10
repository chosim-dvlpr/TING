import { useState } from "react"
import styles from "./ItemModal.module.css"

function ItemModal({closeModal, clickedItem}) {
  const [quantity, setQuantity] = useState(1)

  const changeQuantity = (sign)=>{
    if (sign === '-'){
      if (quantity > 1){
        setQuantity(quantity - 1)
      }
    } else {
      setQuantity(quantity + 1)
    }
  }

  return(
    <div>
      <div className={styles.ModalOuter} onClick={()=>{closeModal()}}></div>
      <div className={styles.ModalInner}>
        <div className={styles.image}></div>
        <h1>{clickedItem.name}</h1>
        <h4>{clickedItem.content}</h4>
        {/* 개수 체크 버튼 */}
        <div className={styles.QuantityBox}>
          <div className={styles.MinusButton} onClick={()=>{changeQuantity('-')}}>-</div>
          <div className={styles.QuantityNum}>{quantity}</div>
          <div className={styles.PlusButton} onClick={()=>{changeQuantity('+')}}>+</div>
        </div>
        {/* 구매하기 버튼 */}
        <div>
          <div><img src={process.env.PUBLIC_URL + '/img/coin.png'} className={styles.coinImage} alt="coin"></img>{clickedItem.price}</div>
          <div className={styles.button}>구매하기</div>
        </div>
      </div>
    </div>
  )
}

export default ItemModal
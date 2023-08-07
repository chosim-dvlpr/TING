import { useState } from "react"
import styles from "./ItemModal.module.css"

function ItemModal({closeModal, clickedItem}) {
  const [quantity, setQuantity] = useState(1)

  return(
    <div>
      <div className={styles.ModalOuter} onClick={()=>{closeModal()}}></div>
      <div className={styles.ModalInner}>
        <h1>{clickedItem.name}</h1>
        <h4>{clickedItem.content}</h4>
        {/* 개수 체크 버튼 */}
        <div className={styles.QuantityBox}>
          <button className={styles.MinusButton}>-</button>
          <span>{quantity}</span>
          <button className={styles.PlusButton}>+</button>
        </div>
      </div>
    </div>
  )
}

export default ItemModal
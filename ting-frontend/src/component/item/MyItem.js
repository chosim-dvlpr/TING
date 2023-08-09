import React, { useEffect, useState } from 'react'
import tokenHttp from "../../api/tokenHttp";
import { useDispatch, useSelector } from 'react-redux';
import { setMyItemList } from '../../redux/itemStore';
import styles from './MyItem.module.css'
import ItemModal from "./common/ItemModal"


function MyItem() {
  const myItemList = useSelector(state => state.itemReducer.myItemList)
  const dispatch = useDispatch()
  const [modalSign, setModalSign] = useState(false)
  const [clickedItem, setClickedItem] = useState({})

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
  
  useEffect(()=>{
    tokenHttp.get('/item/user')
      .then(response => {
        console.log(response.data)
        dispatch(setMyItemList(response.data.data))
      })
      .catch(err => console.log(err))
  },[])


  return(
    <div>
      <div>내 아이템</div>
      <div className="container">
        <div className={`row ${styles.ItemCardList}`}>
          {
            myItemList.map((item,idx)=>(
              <div className={`col-4 ${styles.ItemCardOuter}`} onClick={()=>{openModal(item)}}>
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

      {
        modalSign ? <ItemModal closeModal={closeModal} clickedItem={clickedItem}/> : null
      }

    </div>
  )
}

export default MyItem
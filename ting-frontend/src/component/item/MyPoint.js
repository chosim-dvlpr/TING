import React from 'react';
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import tokenHttp from "../../api/tokenHttp";
import { setPoint } from "../../redux/itemStore";
import styles from "./MyPoint.module.css"

function MyPoint() {
  const [chargeMenu, setChargeMenu] = useState(false)

  // redux 관련 변수
  const dispatch = useDispatch()
  const state = useSelector((state)=>state)
  const myPoint = state.itemReducer.myPoint


  // 자신의 포인트가 얼마인지 가져옴(마운트 될 때 한 번)
  useEffect(()=>{
    tokenHttp.get('/point')
      .then(response => {
        if (response.data.data !== myPoint ) {
          dispatch(setPoint(response.data.data))
        }
      })
      .catch(err => console.log(err))
  },[]);

  // 포인트 충전으로 보내는 함수
  const chargePoint = () => {

  }

  return(
    <div>
      <div className={styles.MyPoint}>
        <span className={styles.PointText}>{ myPoint } Point</span>
        <div className={styles.ChargeButton} 
        onClick={()=>{setChargeMenu(!chargeMenu)}}>
          포인트 충전
        </div>
      </div>
      { chargeMenu ? <SelectMoney/> : null }

      <div>
        <p>포인트 사용 내역</p>
        <div>테이블 예정</div>
      </div>
    </div>
  )
}

// 컴포넌트는 대문자로 시작해야 인식함
// 
function SelectMoney(){
  const money = [1000,3000,5000,10000,50000]

  return(
    <div>
      <div>
        {money.map((money,idx) => (
          <button key={idx}>{money}</button>
        ))}
      </div>
      <div>카카오페이 버튼</div>
    </div>
  )
}

export default MyPoint
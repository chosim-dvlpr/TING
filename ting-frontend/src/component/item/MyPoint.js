import React from 'react';
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import tokenHttp from "../../api/tokenHttp";
import { setPoint } from "../../redux/itemStore";
import { setPointPaymentId } from '../../redux/itemStore';
import styles from "./MyPoint.module.css"

function MyPoint() {
  const [chargeMenu, setChargeMenu] = useState(false)

  // redux 관련 변수
  const dispatch = useDispatch()
  const myPoint = useSelector((state) => state.itemReducer.myPoint)

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

  return(
    <div>
      <div className={styles.MyPoint}>
        <span className={styles.PointText}>
        <img src={process.env.PUBLIC_URL + '/img/coin.png'} className={styles.coinImage} alt="coin"></img>
          { myPoint } Point</span>
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
  const dispatch = useDispatch()


  // api로 충전할 돈의 정보
  const [chargeMoneyData, setChargeMoneyData] = useState([])
  
  // 충전하기 위해 보낼 정보
  const [selectChargeMoneyData, setSelectChargeMoneyData] = useState({})
  
  useEffect(()=>{
    tokenHttp.get('/point/charge/list')
      .then(response => {
        setChargeMoneyData(response.data.data)
        console.log(response.data.data)
      })
      .catch(err => console.log(err))
  },[])

  // 카카오 페이로 보내기 위한 함수
  const sendToKakaoPay = () => {
    let data = {
      pointCode: selectChargeMoneyData.pointCode,
      domain: "http://localhost:3000"
    }
    tokenHttp.post('/point/kakaopay/ready', data)
      .then(response => {
        console.log(response.data.data)
        dispatch(setPointPaymentId(response.data.data.pointPaymentId))
        window.location.href = response.data.data.redirectUrl;
      })
      .catch(err => console.log(err))
    
  }

  return(
    <div>
      <div>
        {chargeMoneyData.map((money,idx) => (
          <button key={idx} onClick={()=>{
            setSelectChargeMoneyData(money)
          }}>{money.totalAmount}</button>
        ))}
      </div>
      <button onClick={()=>{sendToKakaoPay()}}>카카오페이 버튼</button>
    </div>
  )
}

export default MyPoint
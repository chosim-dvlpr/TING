import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import tokenHttp from '../../api/tokenHttp';
import { useSelector } from 'react-redux';

function KakaoPaySuccess(){
  // 경로 param 받아오기
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pgToken = searchParams.get('pg_token')

  const navigate = useNavigate()
  const state = useSelector(state => state)
  const pointPaymentId = state.itemReducer.pointPaymentId

  useEffect(()=>{
    let data = {
      pgToken : pgToken,
      pointPaymentId : pointPaymentId
    }
    tokenHttp.post('/point/kakaopay/approve',data)
      .then(response => {
        console.log(response.data)
        afterNavigate('/item/mypoint')
      })
      .catch(err => console.log(err))
  },[])

  // 한차례 더 넘어서 가도록 비동기 처리
  const afterNavigate = (link)=>{
    navigate(link)
  }

  return (
    <div>
      <p>카카오페이 결제가 성공적으로 완료되었습니다.</p>
    </div>
  )
}

export default KakaoPaySuccess
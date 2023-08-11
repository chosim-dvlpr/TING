import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function KakaoPayCancel(){
  const navigate = useNavigate()

  // 한차례 더 넘어서 가도록 비동기 처리
  const afterNavigate = (link)=>{
    navigate(link)
  }

  useEffect(()=>{
    alert('카카오페이 결제가 실패했습니다.')
    afterNavigate('/item/mypoint')
  },[afterNavigate])

  return (
    <div>
      <p>카카오페이 결제가 취소되었습니다.</p>
    </div>
  )
}

export default KakaoPayCancel
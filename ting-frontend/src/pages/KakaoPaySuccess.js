import React from 'react';
import { useLocation } from 'react-router-dom';

function KakaoPaySuccess(){
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pgToken = searchParams.get('pg_token')

  return (
    <div>
      <p>카카오페이 결제가 성공적으로 완료되었습니다.</p>
      {pgToken}
    </div>
  )
}

export default KakaoPaySuccess
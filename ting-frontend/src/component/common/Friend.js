import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom"

function Friend(){
  let Navigate = useNavigate();
  let userdata = useSelector((state) => state.userdataReducer.userdata);

  // 렌더링 시 유저 확인
  useEffect(() => {
    if (!userdata) {
      alert('로그인이 필요합니다.');
      Navigate("/login");
    }
  }, [])


  return (
    <div>
      <h3>내 어항</h3>
      {/* 닫기 버튼 누르면 뒤로가기로 일단 만들어놨음 */}
      {/* <button onClick={() => Navigate(-1)}>닫기버튼</button> */}
      <br/>

      {/* 돋보기 버튼 클릭 시 닉네임 검색 창 뜨도록 */}
      {/* { isSearchFriend && <input type="text" onSubmit={() => findFriend()}></input> } */}
      {/* <button onClick={() => setIsSearchFriend(!isSearchFriend)}>돋보기버튼</button> */}

      <Outlet></Outlet>
    </div>
  )
}





export default Friend

import { useNavigate } from "react-router-dom"
import { useState } from "react"


function Detail(){
  const Navigate = useNavigate()
  let [name, setName] = useState("")
  let [nickname, setNickname] = useState("")
  let [birth, setBirth] = useState("")


  return(
    <div>
      <p>상세정보를 입력해주세요</p>
      <input type="text" onChange={(e) => {setName(e.target.value)}} placeholder="이름"></input>
      <input type="text" onChange={(e) => {setNickname(e.target.value)}} placeholder="닉네임"></input>
      <p>닉네임은 한글로만 작성해야하며, 닉네임은 중복될 수 없습니다.</p>
      <button>남</button>
      <button>여</button>
      <br/>
      <input type="text" onChange={(e) => {setBirth(e.target.value)}} placeholder="생년월일 6자리"></input>
      <p>여기 지역 들어가야함</p>
      <button onClick={()=>{ Navigate("/signup/beforeSelection")}}>회원 가입 완료</button>
    </div>
  )
}

export default Detail
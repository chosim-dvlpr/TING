import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PhoneNumber(){
  const Navigate = useNavigate()
  let [phonenumber, setPhonenumber] = useState("")
  
  return(
    <div>
      <label htmlFor='phonenumber'>전화번호를 입력해주세요</label>
      <br/>
      <input type="text" id="phonenumber" onChange={(e) => {setPhonenumber(e.target.value)}} placeholder="전화번호('-'제외)"/>
      <button onClick={()=>{ Navigate("/signup/certPhonenum")}}>인증하기</button>
    </div>
  )
}

export default PhoneNumber
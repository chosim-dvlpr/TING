
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CertificationPhonenumber(){
  let [phonenumber, setPhonenumber] = useState("")
  const Navigate = useNavigate()

  return(
    <div>
      <h1>전화번호 인증</h1>
      <div>
        <label htmlFor='phonenumber'>전화번호를 입력해주세요</label>
        <br/>
        <input type="text" id="phonenumber" onChange={(e) => {setPhonenumber(e.target.value)}} placeholder="전화번호"/>
        <br/>
        <input type="text" onChange={(e) => {}} placeholder="인증번호 6자리"/>
        <br/>
        <button onClick={()=>{ Navigate("/signup/detail")}}>다음</button>
    </div>

    </div>
  )
}

export default CertificationPhonenumber
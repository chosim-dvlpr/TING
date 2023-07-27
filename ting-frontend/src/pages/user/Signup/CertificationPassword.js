
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

import basicHttp from '../../../api/basicHttp';

function CertificationPhonenumber(){
  // let [phonenumber, setPhonenumber] = useState("")
  let phonenumber = useSelector((state) => state.signupReducer.phonenumber);
  let [phonenumberAuthCode, setPhonenumberAuthCode] = useState("");
  const Navigate = useNavigate()

  const checkPhonenumber = () => {
    let data = {
      phoneNumber: phonenumber,
      authCode: phonenumberAuthCode
    }

    basicHttp.post('/user/phoneauth', data).then((response) => {
      if (response.data.code === 200) {
        alert("인증 성공");
        Navigate("/");
      }
      else if (response.data.code === 400) {
        alert("인증 실패");
      }
      else if (response.data.code === 401) {
        alert("문자 인증 실패");
      }
    })
    .catch(() => console.log("실패"));
  };
  


  return(
    <div>
      <h1>전화번호 인증</h1>
      <div>
        <label htmlFor='phonenumber'>전화번호를 입력해주세요</label>
        <br/>
        <input type="text" id="phonenumber"  value={ phonenumber } placeholder="전화번호" readOnly />
        <br/>
        <input type="text" onChange={(e) => { setPhonenumberAuthCode(e.target.value) }} placeholder="인증번호 6자리"/>
        <br/>
        <button onClick={()=>{ Navigate("/signup/detail")}}>다음</button>
    </div>

    </div>
  )
}

export default CertificationPhonenumber

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

import basicHttp from '../../../api/basicHttp';

function CertificationPhonenumber(){
  let phonenumber = useSelector((state) => state.signupReducer.phonenumber);
  let [phonenumberAuthCode, setPhonenumberAuthCode] = useState("");
  const Navigate = useNavigate()

  // 버튼 활성화 여부
  // let [isCertPhoneButtonDisabled, setIsCertPhoneButtonDisabled] = useState(true);

  const checkPhonenumberCode = () => {
    let data = {
      phoneNumber: phonenumber,
      authCode: phonenumberAuthCode
    }

    if (data.authCode.length === 4) {
      basicHttp.post('/user/phoneauth', data).then((response) => {
        console.log(response)
        if (response.data.code === 200) {
          alert("인증 성공");
          Navigate("/signup/detail");
        }
        else if (response.data.code === 400) {
          alert("인증 실패");
        }
        else if (response.data.code === 401) {
          alert("문자 인증 실패");
        }
      })
      .catch(() => console.log("실패"));
    }
  };

  const checkPhonenumber = useCallback(() => {
    // 연락처에 '-' 제거 필요
    basicHttp.get(`/user/phoneauth/${phonenumber}`).then((response) => {
      if (response.data.code === 200) {
        alert("인증 메세지가 전송되었습니다.");
      }
      else if (response.data.code === 400) {
        alert("인증 실패");
      }
      else if (response.data.code === 401) {
        alert("문자 발송에 실패했습니다. 다시 인증해주세요.");
      }
    })
    .catch(() => console.log("실패"));
  })
  


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
        <button onClick={checkPhonenumberCode}>인증확인</button>
        <button onClick={checkPhonenumber}>재전송</button>
    </div>

    </div>
  )
}

export default CertificationPhonenumber
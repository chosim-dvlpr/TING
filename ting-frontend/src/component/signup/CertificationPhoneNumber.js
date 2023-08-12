
import { useCallback, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import basicHttp from '../../api/basicHttp';
import { setPhonenumber } from '../../redux/signup';

import styles from './SignupCommon.module.css'

function CertificationPhonenumber(){
  let phonenumber = useSelector((state) => state.signupReducer.phonenumber);
  let [phonenumberAuthCode, setPhonenumberAuthCode] = useState("");
  const Navigate = useNavigate()
  
  let dispatch = useDispatch();

  // 버튼 활성화 여부
  // let [isCertPhoneButtonDisabled, setIsCertPhoneButtonDisabled] = useState(true);

  const checkPhonenumberCode = () => {
    let data = {
      phoneNumber: phonenumber,
      authCode: phonenumberAuthCode
    }

    if (data.authCode.length === 4) {
      basicHttp.post('/user/phoneauth', data).then((response) => {
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

  // 인증번호 재전송
  const checkPhonenumber = () => {
    // 연락처에 '-' 제거 필요
    basicHttp.get(`/user/phoneauth/${phonenumber}`).then((response) => {
      if (response.data.code === 200) {
        alert("인증 메세지가 전송되었습니다.");
        dispatch(setPhonenumber(phonenumber));
      }
      else if (response.data.code === 400) {
        alert("인증 실패");
      }
      else if (response.data.code === 401) {
        alert("문자 발송에 실패했습니다. 다시 인증해주세요.");
      }
    })
    .catch(() => console.log("실패"));
  }

  const authCodeInput = useRef();
  useEffect(() => {
    authCodeInput.current.focus();
  })

  return(
    <div className={styles.wrapper}>
      {/* <p>{ phonenumber }</p> */}
      <label className={styles.label} htmlFor='phonenumber'>문자로 발송된 인증번호를 입력해주세요</label>
      <br/>
      <input className={styles.input} type="text" id="phonenumber"  value={ phonenumber } placeholder="전화번호" readOnly />
      <br/>
      <input ref={authCodeInput} className={styles.input} type="text" onChange={(e) => { setPhonenumberAuthCode(e.target.value) }} placeholder="인증번호 4자리"/>
      <br/>
      <button className={styles.btn} onClick={checkPhonenumberCode}>인증확인</button>
      <button className={styles.btn} onClick={checkPhonenumber}>재전송</button>
  </div>
  )
}

export default CertificationPhonenumber
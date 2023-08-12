import { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../api/basicHttp';
import { setPhoneNumber } from '../../redux/signup';

import styles from './SignupCommon.module.css'

function SignUpPhoneNumber(){
  let [inputPhonenumber, setInputPhonenumber] = useState("");
  let [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 활성화 여부

  const Navigate = useNavigate()
  // let phonenumber = useSelector((state) => state.signupReducer.phonenumber);
  let dispatch = useDispatch();

  useEffect(() => {
    setIsButtonDisabled(false);
  })
  
  const checkPhonenumber = () => {
    // 연락처에 '-' 제거 필요
    basicHttp.get(`/user/phoneauth/${inputPhonenumber}`).then((response) => {
      if (response.data.code === 200) {
        alert("인증 메세지가 전송되었습니다.");
        dispatch(setPhoneNumber(inputPhonenumber));
        Navigate("/signup/certPhonenum");
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

  const phonenumInput = useRef();
  useEffect(() => {
    phonenumInput.current.focus();
  })

  return(
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor='phonenumber'>전화번호를 입력해주세요</label>
      <br/>
      <input ref={phonenumInput} className={styles.input} type="text" id="phonenumber" 
        onChange={(e) => {
          if (e.target.value.length === 11) {
            setIsButtonDisabled(false);
            setInputPhonenumber(e.target.value);
          };
        }}
        placeholder="전화번호('-'제외)"/>
      <button
        className={isButtonDisabled ? styles.disabledBtn : styles.btn} 
        onClick={checkPhonenumber} 
        disabled={isButtonDisabled}>
        인증하기
      </button>
    </div>
    )
  }


export default SignUpPhoneNumber
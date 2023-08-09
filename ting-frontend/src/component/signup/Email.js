import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../api/basicHttp';
import { setEmail } from '../../redux/signup';
import styles from './SignupCommon.module.css'

function InputEmail(){
  let [inputEmail, setInputEmail] = useState("");
  let signupReducer = useSelector((state) => state.signupReducer);
  let [msg, setMsg] = useState("");
  const Navigate = useNavigate()
  let dispatch = useDispatch();

  const emailInput = useRef();
  
  useEffect(() => {
    emailInput.current.focus();
  })

    // 이메일이 형식에 맞는지 확인
    const checkData = () => {
      const check = "@";
      if (inputEmail.includes(check)) {
        return true;
      }
      else { return false }; 
    }

    // 이메일 중복 체크
    const checkEmail = () => {
      storeRedux();
      basicHttp.get(`/user/email/${signupReducer.email}`).then((response) => {
        console.log(response)
        // 중복체크 성공 시 인증화면으로 이동
        if (response.data.code === 200) {
          alert("인증 메일이 전송되었습니다.");
          Navigate("/signup/certEmail");
        }
        else {
          console.log("중복");
          setMsg("중복된 이메일입니다.");
        }
      })
      .catch(() => console.log("실패"))
    }

    // 이메일을 redux에 저장
    const storeRedux = () => {
      dispatch(setEmail(inputEmail));
    }

  return(
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor='email'>이메일을 입력해주세요</label>
      <br/>
      {/* <input type="text" id="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일"/> */}
      <input ref={emailInput} className={styles.input} type="email" id="email" onChange={(e) => {
        setInputEmail(e.target.value);
        }} placeholder="이메일"/>
      <button className={styles.btn} 
          onClick={() => {
            if (checkData()) {
              checkEmail();
            } else { alert('이메일이 형식에 맞지 않음') };
          }}
        >인증하기</button>
      <br />
      {msg}
    </div>
  )
}

export default InputEmail
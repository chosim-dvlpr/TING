import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import basicHttp from '../../api/basicHttp';
import { setEmail } from '../../redux/signup';
import styles from './SignupCommon.module.css'

function InputEmail(){
  // let [email, setEmail] = useState("")
  let signupReducer = useSelector((state) => state.signupReducer);
  // let email = useSelector((state) => state.signupReducer.email);
  let [msg, setMsg] = useState("");
  const Navigate = useNavigate()

  let dispatch = useDispatch();

  const emailInput = useRef();
  useEffect(() => {
    emailInput.current.focus();
  })

  return(
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor='email'>이메일을 입력해주세요</label>
      <br/>
      {/* <input type="text" id="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일"/> */}
      <input ref={emailInput} className={styles.input} type="email" id="email" onChange={(e) => {
        if (e.target.value) { // 값이 비어있지 않을 때
          dispatch(setEmail(e.target.value))
        }
        }} placeholder="이메일"/>
      <button className={styles.btn} 
          onClick={() => {
          basicHttp.get(`/user/email/${signupReducer.email}`).then((response) => {
            // 중복체크 성공 시 인증화면으로 이동
            if (response.data.code === 200) {
              alert("인증 메일이 전송되었습니다.");
              Navigate("/signup/certEmail");
            }
            else {
              console.log("중복");
              setMsg(response.data.message);
            }
          })
          .catch(() => console.log("실패"))
          }}
        >인증하기</button>
      <br />
      {msg}
      {/* <button onClick={()=>{ Navigate("/signup/certEmail")}}>인증하기</button> */}
    </div>
  )
}

export default InputEmail
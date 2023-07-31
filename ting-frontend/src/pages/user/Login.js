import { useState } from "react";
import basicHttp from "../../api/basicHttp";
import tokenHttp from "../../api/tokenHttp";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getCurrentUserdata } from "../../redux/userdata";

function Login(){
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  let state = useSelector((state) => state)

  let dispatch = useDispatch();
  let navigate = useNavigate();
  // let userEmail = useSelector((state) => { return state.userReducer.email })
  // let userPassword = useSelector((state) => { return state.userReducer.password })
  // let changeEmail = () => {
  //   dispatch({ type: 200, email: email, password: password })
  // };

  const loginFunc = () => {
    if (!email) {
      alert("Email을 입력하세요.");
    }
    else if (!password ) {
      alert("password를 입력하세요.");
    }
    else {
      let data = {
        email,
        password
      };

      basicHttp.post('/user/login', data).then((response) => {
        if (response.data.code === 200) {
          console.log('성공');
          localStorage.setItem('access-token', response.data.data['access-token']);
          localStorage.setItem('refresh-token', response.data.data['refresh-token']);
          
          // 유저 데이터 redux에 저장
          tokenHttp.get('/user').then((response) => {
            dispatch(getCurrentUserdata(response.data.data))
          })

          navigate("/") // 로그인 완료되면 메인으로 이동
        }
        else {
          alert('아이디/비밀번호가 틀립니다.');
          // input 초기화
          // setEmail("");
          // setPassword("");
        }
      })
      .catch(() => {console.log("실패")})
    }
  }


  return (
    <div>
      <h1>여기는 로그인입니다.</h1>
      
      <input type="text" onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일"/>
      <br/>
      <input type="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="비밀번호"/>
      <br/>
      <button onClick={ ()=>{
        loginFunc();
      } }>로그인</button>
    </div>
  )
};

export default Login;
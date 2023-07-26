import { useState } from "react";
import basicHttp from "../../api/basicHttp";
// import tokenHttp from "../../api/tokenHttp";

import { useSelector, useDispatch } from "react-redux";

function Login(){
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  let dispatch = useDispatch();
  // let userEmail = useSelector((state) => { return state.userReducer.email })
  // let userPassword = useSelector((state) => { return state.userReducer.password })
  // let changeEmail = () => {
  //   dispatch({ type: 200, email: email, password: password })
  // };

  const loginFunc = () => {
    if (!email) {
      alert("Email을 입력하세요!");
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
        if (response.code === 200) {
          console.log('성공');
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
      <input type="text" onChange={(e) => {setPassword(e.target.value)}} placeholder="비밀번호"/>
      <br/>
      <button onClick={ ()=>{
        loginFunc();
      } }>로그인</button>
    </div>
  )
};

export default Login;
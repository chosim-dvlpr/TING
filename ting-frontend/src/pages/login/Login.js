import { useState } from "react";
import basicHttp from "../../api/basicHttp";
// import tokenHttp from "../../api/tokenHttp";

function Login(){
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
   

  function LoginCheckOut(){
    console.log(email)
    console.log(password)
    console.log('로 로그인 시도')
  };

  const loginFunc = () => {
    // e.preventDefault();
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

      basicHttp.post('/user/login', data).then((response) => {})
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
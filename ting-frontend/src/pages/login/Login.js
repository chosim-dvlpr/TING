import { useState } from "react";



function Login(){
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  function LoginCheckOut(){
    console.log(email)
    console.log(password)
    console.log('로 로그인 시도')
  };

  return (
    <div>
      <h1>여기는 로그인입니다.</h1>
      
      <input type="text" onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일"/>
      <br/>
      <input type="text" onChange={(e) => {setPassword(e.target.value)}} placeholder="비밀번호"/>
      <br/>
      <button onClick={ ()=>{
        LoginCheckOut(email,password);
      } }>로그인</button>
    </div>
  )
};

export default Login;
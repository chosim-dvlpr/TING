import {Routes, Route, Navigate, Outlet} from 'react-router-dom'

function SignUp(){

  return(
    <div>
      <h1>회원 가입</h1>
      <Outlet></Outlet>
    </div>
  )
}

export default SignUp
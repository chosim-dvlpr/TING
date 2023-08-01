import {Routes, Route, Navigate, Outlet} from 'react-router-dom'

function SignUpPage(){

  return(
    <div>
      <h1>회원 가입</h1>
      <Outlet></Outlet>
    </div>
  )
}

export default SignUpPage
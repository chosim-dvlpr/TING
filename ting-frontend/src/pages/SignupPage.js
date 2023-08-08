import {Routes, Route, Navigate, Outlet} from 'react-router-dom'
import NavBar from '../component/common/NavBar'

function SignUpPage(){

  return(
    <div>
      <NavBar/>
      <h1>회원 가입</h1>
      <Outlet></Outlet>
    </div>
  )
}

export default SignUpPage
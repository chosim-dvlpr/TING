import {Routes, Route, Navigate, Outlet} from 'react-router-dom'

import styles from './SignupPage.module.css';

function SignUpPage(){

  return(
    <div className={styles.outer}>
      <div className={styles.container}>
        <p className={styles.title}>회원 가입</p>
        <Outlet></Outlet>
      </div>
    </div>
    // <div>
    //   <NavBar/>
    //   <h1>회원 가입</h1>
    //   <Outlet></Outlet>
    // </div>
  )
  
}

export default SignUpPage
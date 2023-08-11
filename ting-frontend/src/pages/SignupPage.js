import {Routes, Route, Navigate, Outlet} from 'react-router-dom'

import styles from './SignupPage.module.css';
import NavBar from "../component/common/NavBar";
import InputEmail from '../component/signup/Email';
import CertificationEmail from '../component/signup/CertificationEmail';
import Password from '../component/signup/Password';
import SignUpPhoneNumber from '../component/signup/PhoneNumber';
import CertificationPhonenumber from '../component/signup/CertificationPhoneNumber';
import Detail from '../component/signup/Detail';

function SignUpPage(){

  return(
    <div className={styles.outer}>
       <NavBar/>
      <div className={styles.container}>
        <p className={styles.title}>회원 가입</p>
        {/* <Outlet></Outlet> */}
        {/* <InputEmail /> */}
        <CertificationEmail />
        <Password />
        {/* <SignUpPhoneNumber /> */}
        <CertificationPhonenumber />
        <Detail />
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
import InputEmail from './Email';
import Password from './Password';
import CertificationPhonenumber from './CertificationPhoneNumber';
import Detail from './Detail';

function SignUpAll(){

  return(
    <div>
        <InputEmail />
        <Password />
        <CertificationPhonenumber />
        <Detail />
    </div>
    // <div>
    //   <NavBar/>
    //   <h1>회원 가입</h1>
    //   <Outlet></Outlet>
    // </div>
  )
  
}

export default SignUpAll
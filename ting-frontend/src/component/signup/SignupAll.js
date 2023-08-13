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
  )
  
}

export default SignUpAll
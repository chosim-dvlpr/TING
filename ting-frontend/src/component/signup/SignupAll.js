import InputEmail from './Email';
import Password from './Password';
import CertificationPhonenumber from './CertificationPhoneNumber';
import Detail from './Detail';
import styles from './SignupCommon.module.css';

function SignUpAll(){

  return(
    <div className={styles.signupAll}>
        <InputEmail />
        <Password />
        <CertificationPhonenumber />
        <Detail />
    </div>
  )
  
}

export default SignUpAll
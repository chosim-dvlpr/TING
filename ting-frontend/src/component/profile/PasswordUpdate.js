import { useEffect, useState } from "react"
import tokenHttp from "../../api/tokenHttp";
import { useNavigate } from "react-router-dom";

function PasswordUpdate() {
  const [isCurrentPasswordModal, setIsCurrentPasswordModal] = useState(true); // 기존 비밀번호 모달
  // const [isNewPasswordModal, setIsNewPasswordModal] = useState(false); // 새로운 비밀번호 모달

  
  
  function CurrentPasswordModal() {
    const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
    
    const checkCurrentPassword = () => {
      let data = {
        password: currentPassword
      }
      tokenHttp.post('/user/check', data).then((response) => {
        // console.log(response.data)

        if (response.data.code === 200) {
          // 비밀번호 일치 시 true
          if (response.data.data) {
            console.log('비밀번호 일치');
            setIsCurrentPasswordModal(false)
          }
          else {
            console.log('정확한 비밀번호를 입력해주세요.')
          }
        }
        else if (response.data.code === 400) {
          console.log('확인 실패')
        }
        else if (response.data.code === 401) {
          console.log('로그인이 필요합니다')
        }
        else if (response.data.code === 403) {
          console.log('권한이 없습니다')
        }
      })
      .catch(() => console.log("실패"));
  
    }

    return (
    <>
      <label htmlFor='currentPassword'>기존 비밀번호를 입력해주세요</label>
      <input type="password" id="password" onChange={(e) => setCurrentPassword(e.target.value)}></input>
      <button type="submit" onClick={() => checkCurrentPassword()}>다음</button>
    </>
    )
  };

  function NewPasswordModal() {
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordCheck, setNewPasswordCheck] = useState("");
    const [checkPasswordMsg, setCheckPasswordMsg] = useState("새로운 비밀번호를 입력해주세요.");
    const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");

    // 버튼 활성화
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const Navigate = useNavigate();

    // 비밀번호 형식 확인
    useEffect(() => {
      // 특수문자, 영문, 8-25자
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      if (newPassword && !passwordRegex.test(newPassword)) {
        setCheckPasswordMsg("비밀번호가 형식에 맞지 않습니다.");
        setIsButtonDisabled(true)
      }
      else if (passwordRegex.test(newPassword)) {
        setCheckPasswordMsg("안전한 비밀번호입니다.");
      } 
    }, [newPassword]);

    // 비밀번호 일치 확인
    useEffect(() => {
      if (newPassword && newPassword === newPasswordCheck) {
        setConfirmPasswordMsg("비밀번호가 일치합니다.");
        setIsButtonDisabled(false); // 일치하면 다음 버튼 활성화
      }
      else {
        setConfirmPasswordMsg("비밀번호가 일치하지 않습니다.");
        setIsButtonDisabled(true);
      }
    }, [newPassword, newPasswordCheck]);

    const changePassword = () => {
      let data = {
        password: newPassword
      }
      tokenHttp.put('/user/password', data).then((response) => {
        // console.log(response.data)
        
        // 비밀번호 변경 완!
        if (response.data.code === 200) {
          console.log('비밀번호 변경 완료!');
          Navigate("/"); // 메인으로 이동하기
        }
        else if (response.data.code === 400) {
          console.log('변경 실패')
        }
        else if (response.data.code === 401) {
          console.log('로그인이 필요합니다')
        }
        else if (response.data.code === 403) {
          console.log('권한이 없습니다')
        }
      })
      .catch(() => console.log("실패"));
    };


    return (
    <>
      <label htmlFor='newPassword'>새로운 비밀번호를 입력해주세요</label><br/>
      <p>새로운 비밀번호</p><br/>
      <input type="password" id="password" onChange={(e) => setNewPassword(e.target.value)}></input>
      <p>영문, 숫자, 특수문자(!@#$%^&*+=-)를 모두 조합, 8자 이상</p>
      <p>{ checkPasswordMsg }</p>
      
      <p>새로운 비밀번호 확인</p>
      <input type="password" id="passwordCheck" onChange={(e) => setNewPasswordCheck(e.target.value)}></input>
      <p>{ confirmPasswordMsg }</p>

      <button type="submit" onClick={() => changePassword()} disabled={isButtonDisabled}>완료</button>
    </>
    )
  };

  return (
    <div>
      <h1>비밀번호 변경</h1>
      {
        isCurrentPasswordModal ? <CurrentPasswordModal /> : <NewPasswordModal />
      }
    </div>
  )
}

export default PasswordUpdate
import { useState } from "react"
import tokenHttp from "../../api/tokenHttp";

function PasswordUpdate() {
  const [isCurrentPasswordModal, setIsCurrentPasswordModal] = useState(true); // 기존 비밀번호 모달
  const [isNewPasswordModal, setIsNewPasswordModal] = useState(false); // 새로운 비밀번호 모달

  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
  
  const checkCurrentPassword = () => {
    // tokenHttp.post('/user/check', currentPassword).then((response) => {
    //   console.log(response)
    //   // setIsNewPasswordModal(true)
    //   // setIsCurrentPasswordModal(false)
    // })
    // .catch(() => console.log("실패"));

  }

  function NewPasswordModal() {
    return (
    <>
      <label htmlFor='currentPassword'>기존 비밀번호를 입력해주세요</label>
      {/* <form> */}
        <input type="password" onChange={(e) => setCurrentPassword(e.target.value)}></input>
      {/* </form> */}
      {currentPassword}
      <button onClick={() => checkCurrentPassword()}>다음</button>
    </>
    )
  };

  function CurrentPasswordModal() {
    return (
    <>
      <p>새로운 비밀번호를 입력해주세요.</p>
      <form>
        <input></input>
      </form>
    </>
    )
  };

  return (
    <div>
      <h1>비밀번호 변경</h1>
      {
        isCurrentPasswordModal ? <NewPasswordModal /> : <CurrentPasswordModal />
      }
    </div>
  )
}

export default PasswordUpdate
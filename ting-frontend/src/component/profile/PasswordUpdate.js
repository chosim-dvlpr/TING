import { useEffect, useState, useRef } from "react";
import tokenHttp from "../../api/tokenHttp";
import { useNavigate } from "react-router-dom";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./PasswordUpdate.module.css";

import Swal from "sweetalert2";

function PasswordUpdate() {
  const [isCurrentPasswordModal, setIsCurrentPasswordModal] = useState(true); // 기존 비밀번호 모달

  function CurrentPasswordModal() {
    const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호

    // 엔터키로 버튼 누를 수 있게
    const activeEnter = (e) => {
      if (e.key === "Enter") {
        checkCurrentPassword();
      }
    };

    const checkCurrentPassword = () => {
      let data = {
        password: currentPassword,
      };
      tokenHttp
        .post("/user/check", data)
        .then((response) => {
          if (response.data.code === 200) {
            // 비밀번호 일치 시 true
            if (response.data.data) {
              setIsCurrentPasswordModal(false);
            } else {
              Swal.fire({
                title: "정확한 비밀번호를 \n입력해주세요.",
                width: 400,
              });
            }
          } else if (response.data.code === 400) {
            Swal.fire({
              title: "사용자 확인에 \n실패하였습니다.",
              width: 400,
            });
            console.log("확인 실패");
          } else if (response.data.code === 401) {
            Swal.fire({
              title: "사용자 확인에 \n실패하였습니다.",
              width: 400,
            });
            console.log("로그인이 필요합니다");
          } else if (response.data.code === 403) {
            Swal.fire({
              title: "사용자 확인에 \n실패하였습니다.",
              width: 400,
            });
            console.log("권한이 없습니다");
          }
        })
        .catch(() => {
          Swal.fire({
            title: "사용자 확인에 \n실패하였습니다.",
            width: 400,
          });
          console.log("실패");
        });
    };

    return (
      <div className={styles.innerWrapper}>
        <label className={commonStyles.label} htmlFor="currentPassword">
          기존 비밀번호를 입력해주세요
        </label>
        <div>
          <input
            className={commonStyles.input}
            type="password"
            id="password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            onKeyDown={(e) => activeEnter(e)}
          />
          <button
            className={commonStyles.btn}
            type="submit"
            onClick={() => checkCurrentPassword()}
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  function NewPasswordModal() {
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordCheck, setNewPasswordCheck] = useState("");
    const [checkPasswordMsg, setCheckPasswordMsg] =
      useState("새로운 비밀번호를 입력해주세요.");
    const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");

    // 버튼 활성화
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const Navigate = useNavigate();

    const checkPwdMsgP = useRef();
    const confirmPwdMsgP = useRef();

    // 비밀번호 형식 확인
    useEffect(() => {
      // 특수문자, 영문, 8-25자
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      if (newPassword && !passwordRegex.test(newPassword)) {
        setCheckPasswordMsg("비밀번호가 형식에 맞지 않습니다.");
        setIsButtonDisabled(true);
        checkPwdMsgP.current.className = styles.wrongMsg;
      } else if (passwordRegex.test(newPassword)) {
        setCheckPasswordMsg("안전한 비밀번호입니다.");
        checkPwdMsgP.current.className = styles.rightMsg;
      } else {
        setCheckPasswordMsg("새로운 비밀번호를 입력해주세요.");
        setIsButtonDisabled(true);
        checkPwdMsgP.current.className = styles.wrongMsg;
      }
    }, [newPassword]);

    // 비밀번호 일치 확인
    useEffect(() => {
      if (newPassword && newPassword === newPasswordCheck) {
        setConfirmPasswordMsg("비밀번호가 일치합니다.");
        setIsButtonDisabled(false); // 일치하면 다음 버튼 활성화
        confirmPwdMsgP.current.className = styles.rightMsg;
      } else {
        setConfirmPasswordMsg("비밀번호가 일치하지 않습니다.");
        setIsButtonDisabled(true);
        confirmPwdMsgP.current.className = styles.wrongMsg;
      }
    }, [newPassword, newPasswordCheck]);

    const changePassword = () => {
      let data = {
        password: newPassword,
      };
      tokenHttp
        .put("/user/password", data)
        .then((response) => {
          // 비밀번호 변경 완!
          if (response.data.code === 200) {
            Swal.fire({ title: "비밀번호가 변경되었습니다.", width: 400 });
            Navigate("/"); // 메인으로 이동하기
          } else if (response.data.code === 400) {
            Swal.fire({ title: "비밀번호 변경에 실패하였습니다.", width: 400 });
            console.log("변경 실패");
          } else if (response.data.code === 401) {
            Swal.fire({ title: "비밀번호 변경에 실패하였습니다.", width: 400 });
            console.log("로그인이 필요합니다");
          } else if (response.data.code === 403) {
            Swal.fire({ title: "비밀번호 변경에 실패하였습니다.", width: 400 });
            console.log("권한이 없습니다");
          }
        })
        .catch(() => {
          Swal.fire({ title: "비밀번호 변경에 실패하였습니다.", width: 400 });
          console.log("실패");
        });
    };

    // 수정 완료 창


    return (
      <div>
        <label className={commonStyles.label}>새로운 비밀번호</label>
        <br />
        <input
          className={commonStyles.input}
          type="password"
          id="password"
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
        <p>영문, 숫자, 특수문자(!@#$%^&*+=-)를 모두 조합, 8자 이상</p>
        <p ref={checkPwdMsgP}>{checkPasswordMsg}</p>
        <label className={commonStyles.label}>새로운 비밀번호 확인</label>
        <br />
        <input
          className={commonStyles.input}
          type="password"
          id="passwordCheck"
          onChange={(e) => setNewPasswordCheck(e.target.value)}
        ></input>
        <p ref={confirmPwdMsgP}>{confirmPasswordMsg}</p>

        <button
          className={
            isButtonDisabled ? commonStyles.disabledBtn : commonStyles.btn
          }
          type="submit"
          onClick={() => changePassword()}
          disabled={isButtonDisabled}
        >
          변경하기
        </button>
      </div>
    );
  }

  return (
    <div className={commonStyles.wrapper}>
      {isCurrentPasswordModal ? <CurrentPasswordModal /> : <NewPasswordModal />}
    </div>
  );
}

export default PasswordUpdate;

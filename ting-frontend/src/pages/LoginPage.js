import basicHttp from "../api/basicHttp";
import tokenHttp from "../api/tokenHttp";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getCurrentUserdata } from "../redux/userdata";
import NavBar from "../component/common/NavBar";
import styles from "./LoginPage.module.css";

import { setMyItemList } from "../redux/itemStore";

function LoginPage() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let state = useSelector((state) => state);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const passwordRef = useRef();

  const loginFunc = () => {
    if (!email) {
      alert("Email을 입력하세요.");
    } else if (!password) {
      alert("password를 입력하세요.");
    } else {
      let data = {
        email,
        password,
      };

      basicHttp
        .post("/user/login", data)
        .then((response) => {
          if (response.data.code === 200) {
            console.log("성공");
            localStorage.setItem(
              "access-token",
              response.data.data["access-token"]
            );
            localStorage.setItem(
              "refresh-token",
              response.data.data["refresh-token"]
            );

            // 유저 데이터 redux에 저장
            tokenHttp.get("/user").then((response) => {
              dispatch(getCurrentUserdata(response.data.data));
              localStorage.setItem("userId", response.data.data.userId);
            });

            // 유저 보유 아이템 redux에 저장
            tokenHttp
              .get("/item/user")
              .then((response) => {
                dispatch(setMyItemList(response.data.data));
              })
              .catch((err) => console.log(err));

            navigate("/"); // 로그인 완료되면 메인으로 이동
          } else {
            // input 값 초기화
            alert("아이디/비밀번호가 틀립니다.");
            setPassword("");
            passwordRef.current.value = "";
            passwordRef.current.focus();
            // navigate("/login");
          }
        })
        .catch(() => {
          console.log("실패");
        });
    }
  };

  // 엔터키로 버튼 누를 수 있게
  const activeEnter = (e) => {
    if (e.key === "Enter") {
      loginFunc();
    }
  };

  return (
    <div className={styles.outer}>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>로그인</h1>

        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="text"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="이메일"
            autoFocus
          />
          <br />
          <input
            ref={passwordRef}
            className={styles.input}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="비밀번호"
            onKeyDown={(e) => activeEnter(e)}
          />
          <br />
          <button
            className={styles.btn}
            onClick={() => {
              loginFunc();
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import styles from "./ItemUseModal.module.css";

import RandomFishModal from "./RandomFishModal";

import tokenHttp from "../../../api/tokenHttp";

import { setNickname } from "../../../redux/signup";
import { getCurrentUserdata } from "../../../redux/userdata";
import basicHttp from "../../../api/basicHttp";

function ItemModal({ closeModal, clickedItem }) {
  // 모달 관련 state
  const [randomFishModalSign, setRandomFishModalSign] = useState(false);

  // 물고기 스킨 관련 state
  const [randomFishData, setRandomFishData] = useState("");

  // 닉네임 변경 관련 state
  const [changeNicknameSign, setChangeNicknameSign] = useState(false);

  let dispatch = useDispatch();

  const closeRandomModal = () => {
    setRandomFishModalSign(false);
  };

  const useClickedItem = () => {
    console.log(clickedItem.name);
    if (clickedItem.name === "물고기 스킨 랜덤박스") {
      tokenHttp
        .put("/item/fishRandomBox")
        .then((response) => {
          // 랜덤 피쉬 모달을 띄워줌
          setRandomFishModalSign(true);
          setRandomFishData(response.data.data.imagePath);

          tokenHttp.get("/user").then((response) => {
            dispatch(getCurrentUserdata(response.data.data));
            localStorage.setItem("userId", response.data.data.userId);
          });
        })
        .catch((err) => console.log(err));
    } else if (clickedItem.name === "닉네임 변경권") {
      setChangeNicknameSign(true);
    }
  };

  return (
    <div>
      <div
        className={styles.ModalOuter}
        onClick={() => {
          closeModal();
        }}
      ></div>
      <div className={styles.ModalInner}>
        <img
          src={`${process.env.PUBLIC_URL}/img/closeIcon.png`}
          className={styles.closeButton}
          onClick={() => {
            closeModal();
          }}
        />
        <div className={styles.image}>
          <img src={clickedItem.img} />
        </div>
        <h2>{clickedItem.name}</h2>
        <div className={styles.description}>{clickedItem.description}</div>

        {/* 사용하기 버튼 */}
        {clickedItem.name === "닉네임 변경권" ||
        clickedItem.name === "물고기 스킨 랜덤박스" ? (
          <div>
            <div className={styles.button} onClick={useClickedItem}>
              사용하기
            </div>
          </div>
        ) : null}
      </div>

      {randomFishModalSign ? (
        <div>
          <RandomFishModal
            randomFishData={randomFishData}
            closeModal={closeModal}
          />
        </div>
      ) : null}

      {changeNicknameSign ? (
        <div>
          <ChangeNicknameModal closeModal={closeModal} />
        </div>
      ) : null}
    </div>
  );

  function ChangeNicknameModal() {
    let [inputNickname, setInputNickname] = useState("");
    let inputNicknameRef = useRef();
    let [checkNickname, setCheckNickname] = useState(false);
    let [newNickname, setNewNickname] = useState("");

    const koreanPattern = /^[가-힣]*$/;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeNickname = () => {
      nicknameIsExist();

      if (newNickname && checkNickname) {
        let data = {
          nickname: newNickname,
        };
        tokenHttp
          .put("/item/changeNickname", data)
          .then((response) => {
            console.log(response);
            changeSuccessAlert();
          })
          .catch((err) => console.log(err));
      }
    };

    const changeSuccessAlert = () => {
      Swal.fire({
        icon: "success",
        title: "닉네임 변경 성공",
      }).then(() => {
        tokenHttp.get("/user").then((response) => {
          dispatch(getCurrentUserdata(response.data.data));
          localStorage.setItem("userId", response.data.data.userId);
        });
        navigate("/item/myitem");
        closeModal();
      });
    };

    // 엔터키로 버튼 누를 수 있게
    const activeEnter = (e, check) => {
      if (e.key === "Enter") {
        switch (check) {
          case nicknameIsExist:
            nicknameIsExist();
            break;
        }
      }
    };

    // 닉네임 중복 체크
    const nicknameIsExist = () => {
      // 닉네임 한글 확인
      // 한글이 아닌 글자가 있다면 경고메세지 출력
      if (!koreanPattern.test(inputNickname)) {
        Swal.fire("한글만 입력 가능합니다.");
      } else if (!inputNickname) {
        Swal.fire("닉네임을 입력해주세요.");
      } else {
        basicHttp
          .get(`/user/nickname/${inputNickname}`)
          .then((response) => {
            if (response.data.code === 200) {
              // 닉네임 중복 시
              if (response.data.data === true) {
                Swal.fire("닉네임이 중복되었습니다.\n다시 작성해주세요.");
                dispatch(setNickname(null));
                return;
              } else {
                // Swal.fire("닉네임 사용이 가능합니다.");
                setCheckNickname(true);
                setNewNickname(inputNickname);
                return;
              }
            } else if (response.data.code === 400) {
              console.log("400 error");
            }
          })
          .catch(() => console.log("실패"));
      }
    };

    return (
      <>
        <div className={styles.ModalInner}>
          <img
            src={`${process.env.PUBLIC_URL}/img/closeIcon.png`}
            className={styles.closeButton}
            onClick={() => {
              closeModal();
            }}
          />
          <div className={styles.image}>
            <img src={`${process.env.PUBLIC_URL}/img/item/ticket_one.png`} />
          </div>
          <h2>닉네임 변경권</h2>

          {/* 닉네임 입력 */}
          <div>
            <input
              className={styles.input}
              ref={inputNicknameRef}
              type="text"
              onChange={(e) => setInputNickname(e.target.value)}
              // onKeyDown={(e) => activeEnter(e, nicknameIsExist)}
              placeholder="새 닉네임"
            ></input>
            <br />
            <button className={styles.button} onClick={() => changeNickname()}>
              변경하기
            </button>
            {/* {checkNickname ? (
              <p className={styles.comment}>닉네임 중복 확인 완료</p>
            ) : (
              <p className={styles.comment}>
                한글로만 작성해야하며, 중복될 수 없습니다.
              </p>
            )}
            {checkNickname ? (
            ) : (
              <button className={styles.btn} onClick={() => nicknameIsExist()}>
                중복확인
              </button>
            )} */}
          </div>
        </div>
      </>
    );
  }
}

export default ItemModal;

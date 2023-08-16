import { Outlet, useNavigate } from "react-router-dom";
import styles from "./SignupCommon.module.css";
import InformationModal from "../profile/common/InformationModal";

import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import {
  completeSignupStep,
  setDrinkingCode,
  setHeightCode,
  setHobbyCodeList,
  setIntroduce,
  setMbtiCode,
  setPersonalityCodeList,
  setReligionCode,
  setSmokingCode,
  setStyleCodeList,
} from "../../redux/signup";
import { dataCode, regionList } from "../../SelectionDataList";
import { useEffect, useRef, useState } from "react";
import fileHttp from "../../api/fileHttp";
import basicHttp from "../../api/basicHttp";
import { createTheme } from "@mui/material";

import Swal from "sweetalert2";

function SelectionData() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);

  const dataCodeCategory = Object.values(dataCode);
  const dataCodeCategorySet = new Set();
  const [dataCodeCategoryList, setDataCodeCategoryList] = useState([]);

  const email = signupReducer.email;
  const password = signupReducer.password;
  const formData = new FormData();

  const userHeight = useRef();

  const getDataCodeCategory = () => {
    dataCodeCategory.forEach((data) => dataCodeCategorySet.add(data.category));

    const categoryList = Array.from(dataCodeCategorySet); // Set을 배열로 변환
    setDataCodeCategoryList(categoryList); // 리스트로 변경
  };

  useEffect(() => {
    getDataCodeCategory();
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#398fa1",
      },
      // secondary: '#8bcad6',
    },
  });

  const handleDropdownItemClick = (data) => {
    switch (data.category) {
      case "MBTI":
        dispatch(setMbtiCode(data));
        break;
      case "DRINKING":
        dispatch(setDrinkingCode(data));
        break;
      case "SMOKING":
        dispatch(setSmokingCode(data));
        break;
      case "RELIGION":
        dispatch(setReligionCode(data));
        break;
      case "HOBBY":
        dispatch(setHobbyCodeList(data));
        break;
      case "PERSONALITY":
        dispatch(setPersonalityCodeList(data));
        break;
      case "STYLE":
        dispatch(setStyleCodeList(data));
        break;
    }
  };

  // 드롭다운
  const contents = (category) => {
    return dataCode
      .filter((data) => data.category.includes(category))
      .map((data, i) => (
        <Dropdown.Item
          onClick={() => {
            handleDropdownItemClick(data);
          }}
          className={styles.dropdownItem}
          key={i}
        >
          {data.name}
        </Dropdown.Item>
      ));
  };

  // 모달 상태 관련
  const [modalSign, setModalSign] = useState(false);
  const [clickedType, setClickedType] = useState();
  const [clickedItems, setClickedItems] = useState();
  const [clickedCurrentData, setClickedCurrentData] = useState();

  // 모달을 여는 함수
  const openModal = () => {
    setModalSign(true);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setModalSign(false);
  };

  let [height, setHeight] = useState("");
  let [currentMbti, setCurrentMbti] = useState("");
  let [currentDrinking, setCurrentDrinking] = useState("");
  let [currentSmoking, setCurrentSmoking] = useState("");
  let [currentReligion, setCurrentReligion] = useState("");
  let [currentHobbyList, setCurrentHobbyList] = useState([]);
  let [currentPersonalityList, setCurrentPersonalityList] = useState([]);
  let [currentJob, setCurrentJob] = useState("");
  let [currentStyleList, setCurrentStyleList] = useState([]);
  let [currentIntroduce, setCurrentIntroduce] = useState("");

  let [currentHobbyListCode, setCurrentHobbyListCode] = useState([]);
  let [currentPersonalityListCode, setCurrentPersonalityListCode] = useState(
    []
  );
  let [currentStyleListCode, setCurrentStyleListCode] = useState([]);

  // list를 코드로 변환
  useEffect(() => {
    let hobbyListCode =
      currentHobbyList && currentHobbyList.map((hobby, i) => hobby.code);
    let personalityListCode =
      currentPersonalityList &&
      currentPersonalityList.map((style, i) => style.code);
    let styleListCode =
      currentStyleList && currentStyleList.map((style, i) => style.code);
    setCurrentHobbyListCode(hobbyListCode);
    setCurrentPersonalityListCode(personalityListCode);
    setCurrentStyleListCode(styleListCode);
  }, [currentHobbyList, currentPersonalityList, currentStyleList]);

  // 파일 업로드
  // 업로드된 이미지 보낼 때 이메일, 비밀번호 함께 보내기 (유저 확인)
  const onUploadImage = (e) => {
    e.preventDefault();

    if (!e.target.files) {
      return;
    }

    formData.append("file", e.target.files[0]);
    formData.append("email", email);
    formData.append("password", password);
  };

  // 파일 api 보내기
  const sendProfileImage = () => {
    fileHttp.post("/user/profile/noToken", formData).then((response) => {
      console.log(response);
      if (response.data.code === 200) {
        return true;
      } else {
        console.log("파일 업로드 실패");
        return false;
      }
    });
  };

  const newProfileSelectData = {
    ...signupReducer,
    mbtiCode: "",
    profileImage: "",
    height: Number(height),
    introduce: currentIntroduce,
    jobCode: currentJob && currentJob.code,
    drinkingCode: currentDrinking && currentDrinking.code,
    religionCode: currentReligion && currentReligion.code,
    mbtiCode: currentMbti && currentMbti.code,
    smokingCode: currentSmoking && currentSmoking.code,
    hobbyCodeList: currentHobbyListCode,
    styleCodeList: currentStyleListCode,
    personalityCodeList: currentPersonalityListCode,
  };

  console.log(newProfileSelectData);

  // 로그인 버튼 클릭 시 데이터 보내기
  const goToLogin = async (MoveTo, data) => {
    try {
      console.log(data);
      if (
        data.height &&
        (Number(data.height) < 120) | (Number(data.height) > 250)
      ) {
        Swal.fire({
          title:
            "올바른 키를 입력해주세요.\n100에서 250 사이의 값만 \n입력 가능합니다.",
          width: 400,
        });
        userHeight.current.value = "";
        return;
      } else {
        basicHttp.post("/user/signup", data).then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            if (formData && sendProfileImage()) {
              // console.log("프로필 이미지 전송 성공");
            }
            Swal.fire({ title: "회원가입이 \n완료되었습니다.", width: 400 });
            dispatch(completeSignupStep());
            navigate(MoveTo);
          } else if (response.data.code === 400) {
            Swal.fire({
              title: "회원가입에 실패하였습니다.\n정확한 정보를 입력해주세요.",
              width: 400,
            });
          }
        });
      }
    } catch (error) {
      console.error("회원가입 실패 에러 ", error);
      Swal.fire({ title: "회원가입에 실패하였습니다." });
    }
  };

  return (
    <div className={styles.selectContainer}>
      <p className={styles.selectTitle}>
        추가 정보를 입력하면 매칭 정확도가 올라가요 :)
      </p>
      {/* <Outlet></Outlet> */}
      {modalSign ? (
        <InformationModal
          type={clickedType}
          items={clickedItems}
          currentData={clickedCurrentData}
          setter={
            clickedType === "MBTI"
              ? setCurrentMbti
              : clickedType === "음주"
              ? setCurrentDrinking
              : clickedType === "흡연"
              ? setCurrentSmoking
              : clickedType === "종교"
              ? setCurrentReligion
              : clickedType === "직업"
              ? setCurrentJob
              : clickedType === "취미"
              ? setCurrentHobbyList
              : clickedType === "성격"
              ? setCurrentPersonalityList
              : setCurrentStyleList
          }
          closeFunc={closeModal}
          color={theme.palette.primary.main}
        />
      ) : null}

      <div className={styles.selectContainerBox}>
        {/* <div className={styles.updateWrapper}> */}
        <div className={styles.updateDiv}>
          <p className={styles.title}>키</p>
          <input
            ref={userHeight}
            id={styles.heightInput}
            className={styles.input}
            type="number"
            onChange={(e) => setHeight(e.target.value)}
          ></input>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>음주</p>
          <div className={styles.dropDown}>
            <div className={styles.dropDownMenu}>
              <span
                onClick={() => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentDrinking);
                  setClickedItems(
                    dataCode.filter((data) =>
                      data.category.includes("DRINKING")
                    )
                  );
                  setClickedType("음주");
                  openModal();
                }}
              >
                {currentDrinking && currentDrinking.name}
              </span>
              {currentDrinking ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentDrinking("");
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>흡연</p>
          <div className={styles.dropDown}>
            <div className={styles.dropDownMenu}>
              <span
                onClick={(data) => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentSmoking);
                  setClickedItems(
                    dataCode.filter((data) => data.category.includes("SMOKING"))
                  );
                  setClickedType("흡연");
                  openModal();
                }}
              >
                {currentSmoking && currentSmoking.name}
              </span>
              {currentSmoking ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentSmoking("");
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>종교</p>
          <div className={styles.dropDown}>
            <div className={styles.dropDownMenu}>
              <span
                onClick={() => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentReligion);
                  setClickedItems(
                    dataCode.filter((data) =>
                      data.category.includes("RELIGION")
                    )
                  );
                  setClickedType("종교");
                  openModal();
                }}
              >
                {currentReligion && currentReligion.name}
              </span>
              {currentReligion ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentReligion("");
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>직업</p>
          <div className={styles.dropDown}>
            <div className={styles.dropDownMenu}>
              <span
                onClick={() => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentJob);
                  setClickedItems(
                    dataCode.filter((data) => data.category.includes("JOB"))
                  );
                  setClickedType("직업");
                  openModal();
                }}
              >
                {currentJob && currentJob.name}
              </span>
              {currentJob ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentJob("");
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.selectContainerBox}>
        <div className={styles.updateDiv}>
          <p className={styles.title}>취미</p>
          <div className={styles.dropDown}>
            <div className={[styles.dropDownMenu, styles.multiple].join(" ")}>
              <span
                onClick={() => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentHobbyList);
                  setClickedItems(
                    dataCode.filter((data) => data.category.includes("HOBBY"))
                  );
                  setClickedType("취미");
                  openModal();
                }}
              >
                {currentHobbyList &&
                  currentHobbyList.map((hobby, i) => "#" + hobby.name + " ")}
              </span>
              {currentHobbyList && currentHobbyList.length > 0 ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentHobbyList([]);
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>성격</p>
          <div className={styles.dropDown}>
            <div className={[styles.dropDownMenu, styles.multiple].join(" ")}>
              <span
                onClick={() => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentPersonalityList);
                  setClickedItems(
                    dataCode.filter((data) =>
                      data.category.includes("PERSONALITY")
                    )
                  );
                  setClickedType("성격");
                  openModal();
                }}
              >
                {currentPersonalityList &&
                  currentPersonalityList.map(
                    (personality, i) => "#" + personality.name + " "
                  )}
              </span>
              {currentPersonalityList && currentPersonalityList.length > 0 ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentPersonalityList([]);
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>스타일</p>
          <div className={styles.dropDown}>
            <div className={[styles.dropDownMenu, styles.multiple].join(" ")}>
              <span
                onClick={() => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentStyleList);
                  setClickedItems(
                    dataCode.filter((data) => data.category.includes("STYLE"))
                  );
                  setClickedType("스타일");
                  openModal();
                }}
              >
                {currentStyleList &&
                  currentStyleList.map((style, i) => "#" + style.name + " ")}
              </span>
              {currentStyleList && currentStyleList.length > 0 ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentStyleList([]);
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>자기소개</p>
          <input
            id={styles.introduceInput}
            className={styles.input}
            onChange={(e) => setCurrentIntroduce(e.target.value)}
          ></input>
        </div>
        <div className={`${styles.updateDiv} ${styles.inputProfile}`}>
          <p className={styles.title}>프로필 사진</p>
          <input
            id={styles.inputProfile}
            type="file"
            accept="image/*"
            onChange={onUploadImage}
          ></input>
        </div>
      </div>

      <div>
        <button
          onClick={() => goToLogin("/login", newProfileSelectData)}
          className={`${styles.btn} ${styles.goToLoginBtn}`}
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}

export default SelectionData;

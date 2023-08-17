import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";
import { dataCode, regionList } from "../../SelectionDataList";
import InformationModal from "./common/InformationModal";

import commonStyles from "./ProfileCommon.module.css";
import styles from "./MyInformation.module.css";
import { createTheme } from "@mui/material";

import Swal from "sweetalert2";

function MyInformationUpdate() {
  let Navigate = useNavigate();
  let dispatch = useDispatch();

  let userdata = useSelector((state) => state.userdataReducer.userdata);
  let [height, setHeight] = useState(userdata.height);
  let [currentMbti, setCurrentMbti] = useState(userdata.mbtiCode);
  let [currentDrinking, setCurrentDrinking] = useState(userdata.drinkingCode);
  let [currentSmoking, setCurrentSmoking] = useState(userdata.smokingCode);
  let [currentReligion, setCurrentReligion] = useState(userdata.religionCode);
  let [currentHobbyList, setCurrentHobbyList] = useState(userdata.userHobbys);
  let [currentPersonalityList, setCurrentPersonalityList] = useState(
    userdata.userPersonalities
  );
  let [currentJob, setCurrentJob] = useState(userdata.jobCode);
  let [currentStyleList, setCurrentStyleList] = useState(userdata.userStyles);
  let [currentIntroduce, setCurrentIntroduce] = useState(userdata.introduce);

  let [currentHobbyListCode, setCurrentHobbyListCode] = useState([]);
  let [currentPersonalityListCode, setCurrentPersonalityListCode] = useState(
    []
  );
  let [currentStyleListCode, setCurrentStyleListCode] = useState([]);

  // 모달 상태 관련
  const [modalSign, setModalSign] = useState(false);
  const [clickedType, setClickedType] = useState();
  const [clickedItems, setClickedItems] = useState();
  const [clickedCurrentData, setClickedCurrentData] = useState();

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

  // 지역을 한글로 변환
  const regionToKor = (regionData) => {
    const matchingRegion = regionList.find(
      (region) => region.regionEn === regionData
    );
    if (matchingRegion) {
      return matchingRegion.regionKor;
    } else {
      return regionData; // 일치하는 지역 정보가 없을 경우 원래 regionData 반환
    }
  };

  let newProfileData = {
    phoneNumber: userdata.phoneNumber,
    region: regionToKor(userdata.region),
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

  // 변경된 프로필 정보를 DB에 저장
  const storeNewProfile = () => {
    tokenHttp
      .put("/user", newProfileData)
      .then((response) => {
        if (response.data.code === 200) {
          Swal.fire({ title: "프로필 수정을 \n완료하였습니다.", width: 400 });
          storeNewProfileToRedux();
          Navigate("/mypage");
        } else if (response.data.code === 400) {
          Swal.fire({ title: "프로필 수정에 \n실패하였습니다.", width: 400 });
          console.log("확인 실패");
        } else if (response.data.code === 401) {
          Swal.fire({ title: "프로필 수정에 \n실패하였습니다.", width: 400 });
          console.log("로그인이 필요합니다");
        } else if (response.data.code === 403) {
          Swal.fire({ title: "프로필 수정에 \n실패하였습니다.", width: 400 });
          console.log("권한이 없습니다");
        }
      })
      .catch(() => {
        Swal.fire({ title: "프로필 수정에 \n실패하였습니다.", width: 400 });
        console.log("실패");
      });
  };

  // 변경된 프로필을 redux에 저장
  const storeNewProfileToRedux = () => {
    newProfileData = {
      ...userdata,
      profileImage: "", // 수정하기
      height: Number(height),
      introduce: currentIntroduce,
      jobCode: currentJob,
      drinkingCode: currentDrinking,
      religionCode: currentReligion,
      mbtiCode: currentMbti,
      smokingCode: currentSmoking,
      userHobbys: currentHobbyList,
      userStyles: currentStyleList,
      userPersonalities: currentPersonalityList,
    };
    dispatch(getCurrentUserdata(newProfileData));
  };

  // 모달을 여는 함수
  const openModal = () => {
    setModalSign(true);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setModalSign(false);
  };

  // 색 지정
  const theme = createTheme({
    palette: {
      primary: {
        main: "#c33f4f",
      },
    },
  });

  return (
    <div className={commonStyles.wrapper}>
      <div className={styles.btnWrapper}>
        <button
          className={commonStyles.btn}
          onClick={() => {
            storeNewProfile();
          }}
        >
          저장
        </button>
      </div>

      <div className={styles.innerWrapper}>
        <table>
          <tr>
            <th className={styles.title}>이름</th>{" "}
            <td>
              <div>{userdata.name}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>성별</th>{" "}
            <td>
              <div>{userdata.gender === "F" ? "여성" : "남성"}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>이메일</th>{" "}
            <td>
              <div>{userdata.email}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>전화번호</th>{" "}
            <td>
              <div>{userdata.phoneNumber}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>생년월일</th>{" "}
            <td>
              <div>{userdata.birth}</div>
            </td>
          </tr>
          <tr>
            <th className={styles.title}>지역</th>{" "}
            <td>
              <div>{regionToKor(userdata.region)}</div>
            </td>
          </tr>
        </table>
      </div>
      <hr />

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

      <div className={styles.updateWrapper}>
        <div className={styles.updateDiv}>
          <p className={styles.title}>키</p>
          <input
            id={styles.heightInput}
            className={styles.input}
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          ></input>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>MBTI</p>
          <div className={styles.dropDown}>
            <div className={styles.dropDownMenu}>
              <span
                onClick={() => {
                  if (modalSign) closeModal();
                  setClickedCurrentData(currentMbti);
                  setClickedItems(
                    dataCode.filter((data) => data.category.includes("MBTI"))
                  );
                  setClickedType("MBTI");
                  openModal();
                }}
              >
                {currentMbti && currentMbti.name}
              </span>
              {currentMbti ? (
                <div className={styles.xImg}>
                  <img
                    src={process.env.PUBLIC_URL + "/img/close_gray.png"}
                    onClick={() => {
                      setCurrentMbti("");
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
                onClick={() => {
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
              {currentHobbyList.length > 0 ? (
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
              {currentPersonalityList.length > 0 ? (
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
              {currentStyleList.length > 0 ? (
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
            value={currentIntroduce}
            onChange={(e) => setCurrentIntroduce(e.target.value)}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default MyInformationUpdate;

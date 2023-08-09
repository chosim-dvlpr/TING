import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";
import { dataCode, regionList } from "../../SelectionDataList";

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import commonStyles from "./ProfileCommon.module.css";
import styles from "./MyInformation.module.css";

function MyInformationUpdate() {
  let Navigate = useNavigate();
  let dispatch = useDispatch();

  let userdata = useSelector((state) => state.userdataReducer.userdata);
  let [nickname, setNickname] = useState(userdata.nickname);
  let [height, setHeight] = useState(userdata.height);
  let [currentMbti, setCurrentMbti] = useState(userdata.mbtiCode);
  let [currentDrinking, setCurrentDrinking] = useState(userdata.drinkingCode);
  let [currentSmoking, setCurrentSmoking] = useState(userdata.smokingCode);
  let [currentReligion, setCurrentReligion] = useState(userdata.religionCode);
  let [currentHobbyList, setCurrentHobbyList] = useState(userdata.userHobbys);
  let [currentPersonalityList, setCurrentPersonalityList] = useState(userdata.userPersonalities);
  let [currentJob, setCurrentJob] = useState(userdata.jobCode);
  let [currentStyleList, setCurrentStyleList] = useState(userdata.userStyles);
  let [currentIntroduce, setCurrentIntroduce] = useState(userdata.introduce);

  let [currentHobbyListCode, setCurrentHobbyListCode] = useState([]);
  let [currentPersonalityListCode, setCurrentPersonalityListCode] = useState([]);
  let [currentStyleListCode, setCurrentStyleListCode] = useState([]);

  let [openMbti, setOpenMbti] = useState(false);

  // list를 코드로 변환
  useEffect(() => {
    let hobbyListCode = currentHobbyList && currentHobbyList.map((hobby, i) => hobby.code);
    let personalityListCode = currentPersonalityList && currentPersonalityList.map((style, i) => style.code);
    let styleListCode = currentStyleList && currentStyleList.map((style, i) => style.code);
    setCurrentHobbyListCode(hobbyListCode);
    setCurrentPersonalityListCode(personalityListCode);
    setCurrentStyleListCode(styleListCode);
  }, [currentHobbyList, currentPersonalityList, currentStyleList]);

  const CustomDropDown = (props) => {
    let callback;
    switch (props.type) {
      case "MBTI":
        callback = setCurrentMbti;
        break;
      case "DRINKING":
        callback = setCurrentDrinking;
        break;
      case "SMOKING":
        callback = setCurrentSmoking;
        break;
      case "RELIGION":
        callback = setCurrentReligion;
        break;
      case "JOB":
        callback = setCurrentJob;
        break;
    }

    if (props.type === "HOBBY") {
      return (
        <>
          {props.items.map((obj, i) =>
            <button className={styles.dropDownBtn} key={i} as="button"
              onClick={() => { deleteDuplicate(currentHobbyList, setCurrentHobbyList, obj); }}>{obj.name}</button>)
          }
        </>
      );
    } else if (props.type === "PERSONALITY") {
      return (
        <>
          {props.items.map((obj, i) =>
            <button className={styles.dropDownBtn} key={i} as="button"
              onClick={() => { deleteDuplicate(currentPersonalityList, setCurrentPersonalityList, obj); }}>{obj.name}</button>)
          }
        </>
      );
    } else if (props.type === "STYLE") {
      return (
        <>
          {props.items.map((obj, i) =>
            <button className={styles.dropDownBtn} key={i} as="button"
              onClick={() => { deleteDuplicate(currentStyleList, setCurrentStyleList, obj); }}>{obj.name}</button>)
          }
        </>
      );
    } else {
      return (
        <>
          {props.items.map((data, i) =>
            <button className={styles.dropDownBtn} key={i} as="button" onClick={() => callback(data)}>{data.name}</button>)
          }
        </>
      );
    }
  }

  // 지역을 한글로 변환
  const regionToKor = (regionData) => {
    // const regionName = regionList.filter((region) => region.regionEn === regionData ? region.regionKor : null)[0].regionKor
    // console.log(regionName)
    // return regionName
    const matchingRegion = regionList.find((region) => region.regionEn === regionData);
    if (matchingRegion) {
      return matchingRegion.regionKor;
    } else {
      return regionData; // 일치하는 지역 정보가 없을 경우 원래 regionData 반환
    }
  };

  // 지역을 영어로 변환
  const regionToEn = (regionData) => {
    const matchingRegion = regionList.find((region) => region.regionKor === regionData);
    if (matchingRegion) {
      return matchingRegion.regionEn;
    } else {
      return regionData; // 일치하는 지역 정보가 없을 경우 원래 regionData 반환
    }
  };

  let newProfileData = {
    phoneNumber: userdata.phoneNumber,
    region: regionToKor(userdata.region),
    // profileImage: userdata.profileImage,
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

  // console.log(newProfileData);
  // console.log(JSON.stringify(newProfileData))
  // console.log(typeof Number(height))

  // 변경된 프로필 정보를 DB에 저장
  const storeNewProfile = () => {
    tokenHttp.put('/user', newProfileData).then((response) => {
      console.log(response)
      if (response.data.code === 200) {
        console.log('저장 완료');
        storeNewProfileToRedux();
        Navigate("/mypage");
      }
      else if (response.data.code === 400) {
        console.log('확인 실패');
      }
      else if (response.data.code === 401) {
        console.log('로그인이 필요합니다');
      }
      else if (response.data.code === 403) {
        console.log('권한이 없습니다');
      }
    })
      .catch(() => console.log("실패"));
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
    }
    dispatch(getCurrentUserdata(newProfileData));
    console.log("Updated profile data:", newProfileData)
  };

  // 중복 제거
  const deleteDuplicate = (List, ListFunc, checkData) => {
    if (List.some(item => item.code === checkData.code)) {
      ListFunc(List.filter(item => item.code !== checkData.code))
    } else {
      ListFunc([...List, checkData])
    }
  }

  return (
    <div className={commonStyles.wrapper}>

      <div className={styles.btnWrapper}>
        <button
          className={commonStyles.btn}
          onClick={() => {
            storeNewProfile();
          }}>
          저장
        </button>
      </div>

      <div className={styles.innerWrapper}>
        <table>
          <tr><th className={styles.title}>이름</th> <td>{userdata.name}</td></tr>
          <tr><th className={styles.title}>성별</th> <td>{userdata.gender === "F" ? "여성" : "남성"}</td></tr>
          <tr><th className={styles.title}>이메일</th> <td>{userdata.email}</td></tr>
          <tr><th className={styles.title}>전화번호</th> <td>{userdata.phoneNumber}</td></tr>
          <tr><th className={styles.title}>생년월일</th> <td>{userdata.birth}</td></tr>
          <tr><th className={styles.title}>지역</th> <td>{regionToKor(userdata.region)}</td></tr>
        </table>
      </div>
      <hr />

      <div className={styles.updateWrapper}>
        <div className={styles.updateDiv}>
          <p className={styles.title}>키</p>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          ></input>
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>MBTI</p>
          <div>
            <div className={styles.dropDownMenu} onClick={() => { setOpenMbti(!openMbti) }}>{currentMbti && currentMbti.name}</div>
            <div className={openMbti ? styles.isOpen : styles.isClose}>
              <CustomDropDown items={dataCode.filter((data) => data.category.includes("MBTI"))} type="MBTI" />
            </div>
          </div>
          {/* <DropdownButton id="dropdown-item-button" title="MBTI">
            {dataCode
              .filter((data) => data.category.includes("MBTI"))
              .map((data, i) =>
                <Dropdown.Item key={i} as="button" onClick={() => setCurrentMbti(data)}>{data.name}</Dropdown.Item>
              )
            }
          </DropdownButton> */}
          {/* <p>{currentMbti && currentMbti.name}</p> */}
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>주량</p>
          <CustomDropDown items={dataCode.filter((data) => data.category.includes("DRINKING"))} type="DRINKING" />
          {/* <DropdownButton id="dropdown-item-button" title="주량">
            {dataCode
              .filter((data) => data.category.includes("DRINKING"))
              .map((data, i) =>
                <Dropdown.Item key={i} as="button" onClick={() => setCurrentDrinking(data)}>{data.name}</Dropdown.Item>
              )
            }
          </DropdownButton> */}
          {currentDrinking && currentDrinking.name}
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>흡연</p>
          <CustomDropDown items={dataCode.filter((data) => data.category.includes("SMOKING"))} type="SMOKING" />
          {/* <DropdownButton id="dropdown-item-button" title="흡연">
            {dataCode
              .filter((data) => data.category.includes("SMOKING"))
              .map((data, i) =>
                <Dropdown.Item key={i} as="button" onClick={() => setCurrentSmoking(data)}>{data.name}</Dropdown.Item>
              )
            }
          </DropdownButton> */}
          {currentSmoking && currentSmoking.name}
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>종교</p>
          <CustomDropDown items={dataCode.filter((data) => data.category.includes("RELIGION"))} type="RELIGION" />
          {/* <DropdownButton id="dropdown-item-button" title="종교">
            {dataCode
              .filter((data) => data.category.includes("RELIGION"))
              .map((data, i) =>
                <Dropdown.Item key={i} as="button" onClick={() => setCurrentReligion(data)}>{data.name}</Dropdown.Item>
              )
            }
          </DropdownButton> */}
          {currentReligion && currentReligion.name}
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>직업</p>
          <CustomDropDown items={dataCode.filter((data) => data.category.includes("JOB"))} type="JOB" />
          {/* <DropdownButton id="dropdown-item-button" title="직업">
            {dataCode
              .filter((data) => data.category.includes("JOB"))
              .map((data, i) =>
                <Dropdown.Item key={i} as="button" onClick={() => setCurrentJob(data)}>{data.name}</Dropdown.Item>
              )
            }
          </DropdownButton> */}
          {currentJob && currentJob.name}
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>취미</p>
          <CustomDropDown items={dataCode.filter((data) => data.category.includes("HOBBY"))} type="HOBBY" />
          {/* <DropdownButton id="dropdown-item-button" title="취미">
            {dataCode
              .filter((data) => data.category.includes("HOBBY"))
              .map((obj, i) => (
                <Dropdown.Item key={i} as="button" onClick={() => {
                  deleteDuplicate(currentHobbyList, setCurrentHobbyList, obj);
                }
                }>{obj.name}</Dropdown.Item>
              ))
            }
          </DropdownButton> */}
          {currentHobbyList && currentHobbyList.map((hobby, i) => (
            hobby.name
          ))}

        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>성격</p>
          <CustomDropDown items={dataCode.filter((data) => data.category.includes("PERSONALITY"))} type="PERSONALITY" />
          {/* <DropdownButton id="dropdown-item-button" title="성격">
            {dataCode
              .filter((data) => data.category.includes("PERSONALITY"))
              .map((obj, i) => (
                <Dropdown.Item key={i} as="button" onClick={() => {
                  deleteDuplicate(currentPersonalityList, setCurrentPersonalityList, obj);
                }
                }>{obj.name}</Dropdown.Item>
              ))
            }
          </DropdownButton> */}
          {currentPersonalityList && currentPersonalityList.map((personality, i) => (
            personality.name
          ))}
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>스타일</p>
          <CustomDropDown items={dataCode.filter((data) => data.category.includes("STYLE"))} type="STYLE" />
          {/* <DropdownButton id="dropdown-item-button" title="스타일">
            {dataCode
              .filter((data) => data.category.includes("STYLE"))
              .map((obj, i) => (
                <Dropdown.Item key={i} as="button" onClick={() => {
                  deleteDuplicate(currentStyleList, setCurrentStyleList, obj);
                }
                }>{obj.name}</Dropdown.Item>
              ))
            }
          </DropdownButton> */}
          {currentStyleList && currentStyleList.map((style, i) => (
            style.name
          ))}
        </div>

        <div className={styles.updateDiv}>
          <p className={styles.title}>자기소개</p>
          <input value={currentIntroduce} onChange={(e) => setCurrentIntroduce(e.target.value)}></input>
        </div>
      </div>
    </div>
  )
}

export default MyInformationUpdate
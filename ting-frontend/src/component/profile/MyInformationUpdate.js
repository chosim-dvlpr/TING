import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";
import { dataCode, regionList } from "../../SelectionDataList";

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

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
  
  // list를 코드로 변환
  useEffect(() => {
    let hobbyListCode = currentHobbyList && currentHobbyList.map((hobby, i) => hobby.code);
    let personalityListCode = currentPersonalityList && currentPersonalityList.map((style, i) => style.code);
    let styleListCode = currentStyleList && currentStyleList.map((style, i) => style.code);
    setCurrentHobbyListCode(hobbyListCode);
    setCurrentPersonalityListCode(personalityListCode);   
    setCurrentStyleListCode(styleListCode);   
  }, [currentHobbyList, currentPersonalityList, currentStyleList]);

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

  // console.log()




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
    <div>
      <h2>정보 수정 페이지</h2>
      <button onClick={() => {
        storeNewProfile();
      }}>저장</button>

      <p>이름 : { userdata.name }</p>
      <p>성별 : { userdata.gender === "F" ? "여성" : "남성" }</p>
      <p>이메일 : { userdata.email }</p>
      <p>전화번호 : { userdata.phoneNumber }</p>
      <p>생년월일 : { userdata.birth }</p>
      <p>지역 : { regionToKor(userdata.region) }</p>
      <p>닉네임 : { userdata.nickname }</p>
      <br/>

      <label>키</label>
      <input 
        type="text" 
        value={ height }
        onChange={(e) => setHeight(e.target.value)}
      ></input>

      <p>
        <DropdownButton id="dropdown-item-button" title="MBTI">
        {dataCode
        .filter((data) => data.category.includes("MBTI"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentMbti(data)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentMbti && currentMbti.name }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="주량">
        {dataCode
        .filter((data) => data.category.includes("DRINKING"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentDrinking(data)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentDrinking && currentDrinking.name }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="흡연">
        {dataCode
        .filter((data) => data.category.includes("SMOKING"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentSmoking(data)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentSmoking && currentSmoking.name }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="종교">
        {dataCode
        .filter((data) => data.category.includes("RELIGION"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentReligion(data)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
      { currentReligion && currentReligion.name }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="취미">
        {dataCode
        .filter((data) => data.category.includes("HOBBY"))
        .map((obj, i) => (
            <Dropdown.Item key={i} as="button" onClick={() => 
              { 
                deleteDuplicate(currentHobbyList, setCurrentHobbyList, obj);
              }
              }>{ obj.name }</Dropdown.Item>
          ))
        }
        </DropdownButton>
        { currentHobbyList && currentHobbyList.map((hobby, i) => (
          hobby.name
        )) }

      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="성격">
        {dataCode
        .filter((data) => data.category.includes("PERSONALITY"))
        .map((obj, i) => (
          <Dropdown.Item key={i} as="button" onClick={() => 
            { 
              deleteDuplicate(currentPersonalityList, setCurrentPersonalityList, obj);
            }
            }>{ obj.name }</Dropdown.Item>
          ))
        }
        </DropdownButton>
        { currentPersonalityList && currentPersonalityList.map((personality, i) => (
          personality.name
        )) }
      </p>
      <br/>

      <p>
        <DropdownButton id="dropdown-item-button" title="직업">
        {dataCode
        .filter((data) => data.category.includes("JOB"))
        .map((data, i) => 
          <Dropdown.Item key={i} as="button" onClick={() => setCurrentJob(data)}>{ data.name }</Dropdown.Item>
        )
        }
        </DropdownButton>
        { currentJob && currentJob.name }
      </p>
      <br/>

      <p>
      <DropdownButton id="dropdown-item-button" title="스타일">
        {dataCode
        .filter((data) => data.category.includes("STYLE"))
        .map((obj, i) => (
          <Dropdown.Item key={i} as="button" onClick={() => 
            { 
              deleteDuplicate(currentStyleList, setCurrentStyleList, obj);
            }
            }>{ obj.name }</Dropdown.Item>
          ))
        }
        </DropdownButton>
        { currentStyleList && currentStyleList.map((style, i) => (
          style.name
        )) }
      </p>
      <br/>
      
      <p>자기소개</p>
      <input value={ currentIntroduce } onChange={(e) => setCurrentIntroduce(e.target.value)}></input>
    </div>
  )
}

export default MyInformationUpdate